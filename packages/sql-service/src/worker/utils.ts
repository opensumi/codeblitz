// @ts-nocheck
/**
 * @description worker中的工具方法
 */
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _isEmpty from 'lodash/isEmpty';
import _union from 'lodash/union';
import _uniq from 'lodash/uniq';
import _get from 'lodash/get';
import _flattenDeep from 'lodash/flattenDeep';
import _findLast from 'lodash/findLast';
import _orderBy from 'lodash/orderBy';
import _uniqBy from 'lodash/uniqBy';
import {
  generateCompleteItem,
  complementedInsertText,
  CompleteType,
  builtInCompletionType,
} from '../types';
import * as ls from 'vscode-languageserver-types';
// import { Errors } from '../tools/goldlog/definition';
import {
  AGGR_FUNCTIONS,
  MATH_FUNCTIONS,
  RANGE_FUNCTIONS,
  OTHER_FUNCTIONS,
  STRING_FUNCTIONS,
  COMPLEX_FUNCTIONS,
  DATE_FUNCTIONS,
} from '../sql-functions/odps';

// 表名输出定义
interface ITableItem {
  name: string; // 字段名称
  alias?: string; // 字段别名
  origin: string; // 透出字段来源于表名
}
// 子查询完整类型定义
interface ITableInfo {
  /** 子查询透出给父查询的所有字段 */
  exportsFields: ITableItem[];
  /** 当前子查询下：表或子子查询维度的信息，若是表名则为[ {name: '*', ...} ]  通常用于嵌套递归情况分析*/
  availableFields: ITableInfo[] | ITableItem[];
  alias: string;
  table: 'SUBQUERY' | string;
}

const checkValues = (visitedTable, query, typeCheck?) => {
  if (typeCheck) {
    return _find(visitedTable, item => item.name === query && item.sqlType === typeCheck);
  }

  return _find(visitedTable, item => item.name === query);
};

/** 递归查找指定属性*/
const deepFind = (aliasMap, filter) => {
  return _filter(
    _flatten(
      aliasMap.map(item => {
        if (filter(item)) {
          return item;
        } else if (_get(item, 'availableFields[0]')) {
          return _flatten(deepFind(item.availableFields, filter));
        } else {
          return;
        }
      }),
    ),
    o => o,
  );
};

/**
 * 处理自动补全场景
 * 1⃣️: table为子查询，且tableSourceItem唯一
 * 2⃣️: table为表名，且tableSourceItem唯一
 * 3⃣️: table为ddl创建场景
 * 4⃣️: tableSourceItem不唯一,提示表名或别名
 */
export function handleAutoComplete(tableSrc, visitedTable, HotWords, completionTypes, ddlMap) {
  if (tableSrc.length === 1 && !tableSrc[0].alias) {
    const query = `${tableSrc[0].table}.`;

    /** 判断是否存在当前文件创建的补全信息，若存在则自动补全 */
    const tablename = query.slice(0, -1);
    const stash = deepFind(ddlMap, item => item.table === tablename)[0];
    if (stash) {
      return {
        hitCache: true,
        items: _flatten(
          stash.availableFields.map(field => {
            if (field.alias) {
              return [
                generateCompleteItem(field.alias, HotWords, false, {
                  detail: completionTypes.FIELDALIAS.text,
                  builtInCompletionType: builtInCompletionType.FIELDALIAS,
                  kind: completionTypes[builtInCompletionType.FIELDALIAS].kind,
                }),
              ];
            } else {
              return [
                generateCompleteItem(field.name, HotWords, false, {
                  detail: completionTypes.FIELD.text,
                  builtInCompletionType: builtInCompletionType.FIELD,
                  kind: completionTypes[builtInCompletionType.FIELD].kind,
                }),
              ];
            }
          }),
        ),
      };
    }

    /** 3. 判断是否为子查询 */
    if (query === 'SUBQUERY.') {
      const fieldsList = _get(tableSrc, '[0].exportsFields', []);
      return {
        hitCache: true,
        items: fieldsList.map(field => {
          // 存在别名时，提示别名
          if (field.alias) {
            return generateCompleteItem(field.alias, HotWords, false, {
              detail: completionTypes.FIELDALIAS.text,
              builtInCompletionType: builtInCompletionType.FIELDALIAS,
              kind: completionTypes[builtInCompletionType.FIELDALIAS].kind,
            });
          }
          return generateCompleteItem(field.name, HotWords, false, {
            detail: completionTypes.FIELD.text,
            builtInCompletionType: builtInCompletionType.FIELD,
            kind: completionTypes[builtInCompletionType.FIELD].kind,
          });
        }),
      };
    }

    /** 表情况，走缓存或请求 */
    const cachedTable = checkValues(visitedTable, query);
    if (cachedTable) {
      return {
        hitCache: true,
        items: (cachedTable.data || []).map(field =>
          generateCompleteItem(
            field.name,
            HotWords,
            false,
            complementedInsertText(field, completionTypes),
          ),
        ),
      };
    } else {
      return {
        hitCache: false,
        params: [query],
        type: CompleteType.field,
      };
    }
  }

  /** 源表不是唯一tableName场景，提示表名前缀 */
  return {
    hitCache: true,
    items: tableSrc.map(table => {
      if (table.table !== 'SUBQUERY' && !table.alias) {
        /** TODO: 如何缓存表名 */
        return generateCompleteItem(table.table, HotWords, false, {
          detail: completionTypes.TABLE.text,
          builtInCompletionType: builtInCompletionType.TABLE,
          kind: completionTypes[builtInCompletionType.TABLE].kind,
        });
      }
      return generateCompleteItem(table.alias, HotWords, false, {
        detail: completionTypes.TABLEALIAS.text,
        builtInCompletionType: builtInCompletionType.TABLEALIAS,
        kind: completionTypes[builtInCompletionType.TABLEALIAS].kind,
      });
    }),
  };
}

export function handleManualComplete(
  tableSrc,
  visitedTable,
  HotWords,
  completionTypes,
  ddlMap,
  prefix,
  targetNode,
) {
  const originPath = prefix.split('.').filter(Boolean);
  if (_isEmpty(originPath)) {
    return;
  }
  const aliasPath = [];
  originPath.forEach(item => {
    // @ts-ignore
    aliasPath.push(deepFind(tableSrc, o => o.alias === item || o.table === item)[0] || {});
  });

  const lastTableInfo: any = aliasPath.slice(-1)[0];
  /**
   * 通过前缀信息，补全字段
   * 1⃣️：前缀为子查询别名，提示子查询的导出字段
   * 2⃣️：前缀为create创建的视图，提示视图的字段
   * 3⃣️：前缀为普通表名，走查询接口
   */
  if (lastTableInfo.table === 'SUBQUERY') {
    /** 通过别名搜索到了子查询 */
    const fieldsList = _get(lastTableInfo, 'exportsFields', []);
    return {
      completeType: 'recombination',
      items: _flattenDeep(
        fieldsList.map((field: any) => {
          if (field.name === '*') {
            const query = `${field.origin}${targetNode.image}`;
            /** 检查缓存 */
            const cachedTable = checkValues(visitedTable, query);

            if (cachedTable) {
              return {
                hitCache: true,
                items: (cachedTable.data || []).map(field =>
                  generateCompleteItem(
                    field.name,
                    HotWords,
                    false,
                    complementedInsertText(field, completionTypes),
                  ),
                ),
              };
            } else {
              return {
                hitCache: false,
                params: [query],
                type: CompleteType.field,
              };
            }
          }

          if (field.alias) {
            /** 设置别名后，则不显示原始字段名 */
            return {
              hitCache: true,
              items: [
                generateCompleteItem(field.alias, HotWords, false, {
                  detail: completionTypes.FIELDALIAS.text,
                  builtInCompletionType: builtInCompletionType.FIELDALIAS,
                  kind: completionTypes[builtInCompletionType.FIELDALIAS].kind,
                }),
              ],
            };
          } else {
            /** TODO: 如何缓存字段名，AST解释时使用 */
            return {
              hitCache: true,
              items: [
                generateCompleteItem(field.name, HotWords, false, {
                  detail: completionTypes.FIELD.text,
                  builtInCompletionType: builtInCompletionType.FIELD,
                  kind: completionTypes[builtInCompletionType.FIELD].kind,
                }),
              ],
            };
          }
        }),
      ),
    };
  } else if (!_isEmpty(lastTableInfo)) {
    const tablename = lastTableInfo.table;
    // 判断表名是否为视图名
    const stash = deepFind(ddlMap, item => item.table === tablename)[0];
    const cpInfo = stash ? stash : lastTableInfo;
    /**
     * @section1 搜索到了表名或者表别名
     * 1⃣️: 全字段，即*，则提取表名，查字段
     * 2⃣️: 非全字段，提示exportsFields中的字段 ??? 不确定是否存在这种情况
     */
    if (cpInfo.availableFields[0].name === '*') {
      const query = `${lastTableInfo.table}.`;
      const cachedTable = checkValues(visitedTable, query);
      if (cachedTable) {
        return {
          hitCache: true,
          items: (cachedTable.data || []).map(field =>
            generateCompleteItem(
              field.name,
              HotWords,
              false,
              complementedInsertText(field, completionTypes),
            ),
          ),
        };
      } else {
        return {
          hitCache: false,
          params: [query],
          type: CompleteType.field,
        };
      }
    } else {
      /** 表字段没有被完全透出 */
      return {
        hitCache: true,
        items: _flatten(
          cpInfo.availableFields.map(field => {
            if (field.alias) {
              return generateCompleteItem(field.alias, HotWords, false, {
                detail: completionTypes.FIELDALIAS.text,
                builtInCompletionType: builtInCompletionType.FIELDALIAS,
                kind: completionTypes[builtInCompletionType.FIELDALIAS].kind,
              });
            } else {
              return generateCompleteItem(field.name, HotWords, false, {
                detail: completionTypes.FIELD.text,
                builtInCompletionType: builtInCompletionType.FIELD,
                kind: completionTypes[builtInCompletionType.FIELD].kind,
              });
            }
          }),
        ),
      };
    }
  } else {
    let finalPath = '';
    aliasPath.forEach((item, idx) => {
      if (!_isEmpty(item) && item.alias) {
        finalPath += `${item.table}.`;
      } else {
        finalPath += `${originPath[idx]}.`;
      }
    });
    finalPath = finalPath.slice(0, -1);

    if (targetNode.image === '.') {
      /** 输入‘.’自动补全场景时，路径尾部需要补全一个‘.’，输入keyword补全时，则不需要补全‘.’ */
      finalPath += '.';
    }

    const cachedTable = checkValues(visitedTable, finalPath);
    if (cachedTable) {
      return {
        hitCache: true,
        items: (cachedTable.data || []).map(field =>
          generateCompleteItem(
            field.name,
            HotWords,
            false,
            complementedInsertText(field, completionTypes),
          ),
        ),
      };
    } else {
      if (originPath.length === 1) {
        /** 最简单的select, from后面仅有一个表名时，用户输入需要补全字段，而此时keyword需要加上表名等信息 */
        finalPath = `${tableSrc[0].table}.${finalPath}`;
      }

      return {
        hitCache: false,
        params: [finalPath],
        type: CompleteType.field,
      };
    }
  }
}

/** 计算parserError信息 */
export function buildError(ast, errors, document, getFilteredNode) {
  let result = [];
  const sqlStatements = _get(ast, 'cst.children.sqlStatements', undefined);
  if (sqlStatements && !_isEmpty(ast.cst.children.sqlStatements[0].children)) {
    /** 多条SQL时，找到每条SQL的首个token与光标的距离最近，且位于光标之前，则为正在编辑的SQL */
    const searchScope = ast.cst.children.sqlStatements[0].children.sqlStatement;
    /** 遍历至倒数第二条sql语句 */
    const allSqls = [];
    for (let i = 0; i < searchScope?.length; i++) {
      const firstToken = getFilteredNode(searchScope[i], item => item.image)[0];
      if (firstToken) {
        allSqls.push(firstToken);
      }
    }
    // const findSqlrange = (error: Errors): ls.Range => {
      const findSqlrange = (error): ls.Range => {
      const token = _get(error, 'token.image') ? error.token : error.previousToken;
      const i = allSqls.findIndex(item => item.startOffset > token.startOffset);
      if (i === 0) {
        // 特殊情况，第一个token位于错误之后，直接全量上报
        return null;
      }
      // 找不到i，因为当前token与句首token相同startOffset，返回数组里最后一句
      if (i <= 0) {
        const startToken = allSqls[0] || token;
        return {
          start: {
            line: startToken.startLine - 1,
            character: startToken.startColumn - 1,
          },
          end: {
            line: 1000,
            character: 1000,
          },
        };
      }
      const prev = allSqls[i - 1];
      const next = allSqls[i];
      return {
        start: {
          line: prev.startLine - 1,
          character: prev.startColumn - 1,
        },
        end: {
          line: next.startLine - 1,
          character: next.startColumn - 1,
        },
      };
    };
    result = errors.map(error => {
      const range = findSqlrange(error);
      return {
        ...error,
        sql: document.getText(range),
      };
    });
  }
  return result;
}

export class Range {
  private character = 0;
  private line = 0;
  constructor(self) {
    this.character = self.character;
    this.line = self.line;
  }

  // 位置是否在之前
  isFrontOf = token => {
    if (token.line > this.line) {
      return true;
    }
    const sameLine = token.line === this.line;
    if (sameLine && token.character >= this.character) {
      return true;
    }
    return false;
  };
}

/** 判断是否需要进入异步查询逻辑 */
export function hasPotentialIds(cstErrors, nextTokens = []) {
  const completeType = cstErrors?.completeType;
  const isId = nextTokens?.some(tk => {
    return tk?.nextTokenType?.name === 'COMMON_STRING' && tk?.ruleStack?.includes('fullId');
  });
  if (isId) return isId;

  /** 缺失set参数，进行set参数提示 */
  const isSetParams = completeType?.some(item => {
    return item.errType === 'COMMON_STRING' && item.context?.ruleStack?.includes('setParamExp');
  });
  if (isSetParams && cstErrors.previousToken?.image === '=') return true;

  // 缺失关键词，根据ast缺失必填词场景下。表名提示场景
  return completeType?.some(item => {
    return (
      item.errType === 'COMMON_STRING' &&
      (
        item.context?.ruleStack?.slice(-1).pop() === 'tableSource' ||
        item.context?.ruleStack?.includes('tableSourceItem')
      )
    );
  });
}

/** 筛选符合条件的节点 */
export const getFilteredNode = (cst, filter, global?: boolean): any | any[] => {
  const queue = [{ ...cst, ruleStack: [] }];
  const result = [];
  while (true) {
    let target = queue.shift();
    if (target) {
      queue.push(
        ..._flatten(Object.values(target.children || [])).reduce(
          (sum: any, item) => sum.concat({ ...item, ruleStack: target.ruleStack.concat(target) }),
          [],
        ),
      );
      if (filter(target)) {
        if (global) {
          result.push(target);
        } else {
          return [target];
        }
      }
    } else {
      return result;
    }
  }
};

const getAlias = (node, aliasName = 'alias') => {
  const aliasUidNode = _get(node, `[${aliasName}][0]`, {});
  const alias = _orderBy(
    getFilteredNode(aliasUidNode, target => target.image, true),
    ['startOffset'],
    ['asc'],
  ).pop();
  return alias?.image ?? '';
};

/** 目前仅用于odps语法的解析，fromSources的解析基于odps来做的 */

/** 盘剥queryStatement */
const peel = (SyntaxKind, TokenEnum) => (cst, once?: boolean) => {
  const query = getFilteredNode(cst, target => target.name === SyntaxKind.selectQueryStatement)[0];

  // FIXME mr记得提醒左羿遗漏了union套娃场景

  const selectElement = getFilteredNode(query, target => target.name === SyntaxKind.selectList)[0]
    ?.children?.[SyntaxKind.selectItem];

  const hasStar =
    query &&
    _find(selectElement, item =>
      _get(item, `children.${SyntaxKind.tableAllColumns}[0].children.${TokenEnum.STAR}`),
    );
  let exportsFields = [];

  /** 异常输入处理，exports中包含*的时候，直接透出* */
  if (selectElement) {
    const fieldsGroup = selectElement.map((fields, index) => {
      let name = '';
      /** 别名识别中，结构为：as? uid?，所以别名名称为最后一个 */
      let alias = getAlias(fields.children);
      /** 函数场景 */
      if (fields.children[SyntaxKind.udfFunctionCall]) {
        /** 未找到函数别名时，则不提示 */
        name = alias ?? '';
      } else if (hasStar) {
        name = '*';
        alias = '';
      } else if (fields.children[SyntaxKind.tableAllColumns]) {
        /** 常规表字段场景 */
        const fullColumnNameStructure = fields.children[SyntaxKind.tableAllColumns][0].children;
        if (fullColumnNameStructure[SyntaxKind.constant]) {
          /** 常量场景 */
          name = getCompletePath(fullColumnNameStructure[SyntaxKind.constant]?.[0]);
        } else {
          name = '';
        }
      } else if (fields.children[SyntaxKind.fullId]) {
        // 存在funcBody等规则名时，非字段场景，只提示别名，否则不提示
        if (
          _isEmpty(fields.children[SyntaxKind.funcBody]) ||
          fields.children[SyntaxKind.expressionRecursionValue]
        ) {
          name = alias ?? '';
        } else {
          /** 级联字段，找到最后一个.之后的值作为字段名 */
          const fullId = getCompletePath(fields.children[SyntaxKind.fullId]?.[0]);
          name = fullId.split('.').pop();
        }
      }

      return {
        name,
        alias,
      };
    });
    exportsFields = _uniqBy(fieldsGroup, 'name');
  }

  const tableInfo = {
    exportsFields,
  };

  const fromClause = _get(
    query,
    `children.${[SyntaxKind.atomQueryExpression]}[0].children.${[SyntaxKind.fromClause]}[0]`,
  );

  return selectElement ? getTableDetails(tableInfo, fromClause, SyntaxKind, true) : null;
};

const getTableDetails = (init, fromClause, SyntaxKind, more?: boolean): ITableInfo[] => {
  return _flattenDeep(
    _get(
      getFilteredNode(fromClause, target => target.name === SyntaxKind.tableSources),
      '[0].children.tableSource',
      [],
    ).map(tableSource => {
      const tableSourceItems = [];
      // join找到子元素
      if (tableSource.children[SyntaxKind.joinPart]) {
        tableSource.children[SyntaxKind.joinPart].forEach(join => {
          tableSourceItems.push(
            getFilteredNode(join, target => target.name === SyntaxKind.fromSource),
          );
        });
      }

      // uniqJoin特例
      if (tableSource.children[SyntaxKind.uniqueJoinSource]) {
        tableSource.children[SyntaxKind.uniqueJoinSource].forEach(uniqJoin => {
          tableSourceItems.push(
            getFilteredNode(uniqJoin, target => target.name === SyntaxKind.fromSource),
          );
        });
      }

      if (tableSource.children[SyntaxKind.fromSource]) {
        tableSourceItems.push(tableSource.children[SyntaxKind.fromSource]);
      }

      return tableSourceItems;
    }),
  ).map((table: any) => {
    let tableInfo: ITableInfo = {
      /** 子查询透出给父查询的字段 */
      exportsFields: [],
      /** 子查询中可以自动补全的字段, 表粒度的tableInfo */
      availableFields: [],
      alias: '',
      table: 'SUBQUERY',
      ...init,
    };

    /** 获取表名，如果可以得到表名，export字段为表的全字段 */
    if (table.children[SyntaxKind.tableSourceItem]) {
      const tableNode = table.children[SyntaxKind.tableSourceItem][0];
      // 走个一日千里，取个表全名
      const tableName = getCompletePath(tableNode.children[SyntaxKind.tableName][0]);
      tableInfo.table = tableName;

      /** 获取别名 */
      tableInfo.alias = getAlias(tableNode?.children);

      /** 额外的表名字段便于外部获取到全字段场景时，可以根据表明查询字段 */
      tableInfo.availableFields = [
        {
          name: '*',
          alias: '',
          origin: tableName,
        },
      ];

      // TODO: 是否要区分，exportsFields中的字段，是否为该表的字段。
      tableInfo.exportsFields = tableInfo.exportsFields.map(item => ({
        ...item,
        origin: tableName,
      }));
    }

    if (more && table.children[SyntaxKind.subQuerySource]) {
      const queryNode = table.children[SyntaxKind.subQuerySource][0].children;
      // 判断当前子查询是否存在别名，没有别名就不需要解析了
      const alias = getAlias(queryNode);
      if (!alias) {
        return tableInfo;
      }

      tableInfo.alias = alias;

      // 只用到Star 用于判断全量查询的情况 select *
      const recurive = peel(SyntaxKind, { STAR: 'STAR' })(
        _get(queryNode, 'subQueryExpression[0]'),
        true,
      );

      tableInfo.availableFields = recurive;
      if (!tableInfo.exportsFields[0] || _get(tableInfo, 'exportsFields[0].name') === '*') {
        /** 重置exportsFields，
         * 默认情况读取select之后的内容作为exportsFields，
         * 为*的时候，将子查询的exportsFields作为当前语句的导出字段。
         * @特例 当子查询全部为*时，在worker中需要递归到最底层的子查询，找到【表名】去查询
         */

        tableInfo.exportsFields = _uniqBy(
          _flatten(recurive.map(item => item.exportsFields)),
          'name',
        );
      }
    }

    return tableInfo;
  });
};

/** cst结构中，通用异步分析逻辑覆盖不到的场景 */
function getAutoCompelete(ruleStacks) {
  // query场景下，表达式
  const isFunctionCall =
    ruleStacks.includes('selectQueryStatement') && ruleStacks.slice(-1)[0] === 'functionCall';

  // selectItem场景下，函数内嵌套
  const isSelectItemUdf =
    ruleStacks.includes('selectItem') &&
    ['udfFunctionCall', 'funcBody'].includes(ruleStacks.slice(-1)[0]);

  // selectItem,where场景下，深度查询。用于接口返回不全量，输入前缀请求继续查询的场景。
  const isSelectItemDeepQuery =
    (ruleStacks.includes('selectItem') || ruleStacks.includes('whereClause')) &&
    ['fullId'].includes(ruleStacks.slice(-1)[0]);

  return isFunctionCall || isSelectItemUdf || isSelectItemDeepQuery;
}

/** 提取一个方案，用于解决大量重复的generate字段名和别名的场景 */
function formatLabel(text, completionTypes, isAlias = false) {
  const type = isAlias ? completionTypes.FIELDALIAS : completionTypes.FIELD;
  return [
    generateCompleteItem(text, [], false, {
      detail: type.text,
      builtInCompletionType: type,
      kind: type.kind,
    }),
  ];
}

function getCompletePath(node: { children: any }) {
  return _orderBy(
    getFilteredNode(node, target => target.image, true),
    ['startOffset'],
    ['asc'],
  )
    .map(item => item.image)
    .join('');
}

/** 分析AST结构，找到表名或字段名 */
// TODO: 统一worker中解析逻辑，通过规则名映射
export function AnalyzeQueryStatement(
  targetNode,
  SyntaxKind,
  completionTypes,
): {
  keyword?: string;
  type: CompleteType;
  items?: any[];
  completeType?: string;
} {
  const isTable =
    targetNode.name === SyntaxKind.tableSource ||
    _find(targetNode.ruleStack, { name: SyntaxKind.tableName });
  // 表名
  if (isTable) {
    let keyword = '';
    // tableName为当前编辑rule的最小单元。用于判断是否存在部分内容。如：LD_BIZ.
    const fulltableNameNode = _find(targetNode.ruleStack, {
      name: SyntaxKind.tableName,
    });
    if (fulltableNameNode) {
      keyword = getCompletePath(fulltableNameNode);
    }

    return {
      keyword,
      type: CompleteType.table,
    };
  }

  // set参数提示
  const isSet =
    targetNode.name === SyntaxKind.setSpec ||
    _find(targetNode.ruleStack, { name: SyntaxKind.setStatement });
  /** set参数值提示 */
  const isSetValue =
    targetNode?.image === '=' &&
    targetNode?.ruleStack?.slice(-1)?.[0]?.name === SyntaxKind.setParamExp;

  if (isSet && !isSetValue) {
    const keyword = '';
    return {
      keyword,
      type: CompleteType.setParam,
    };
  }

  if (isSetValue) {
    const setParamExp = targetNode.ruleStack.slice(-1);
    const fullIdStatement = _get(setParamExp, '[0].children.fullId[0].children');
    const firFullIdName = _get(fullIdStatement, 'COMMON_STRING[0].image');
    const allNames = [firFullIdName];
    const dotColumns = _get(fullIdStatement, 'dottedColumnId', []);
    for (const column of dotColumns) {
      const columnName = _get(column, 'children.uid[0].children.COMMON_STRING[0].image');
      if (columnName) {
        allNames.push(columnName);
      }
    }
    return {
      keyword: allNames.join('.'),
      type: CompleteType.setValue,
    };
  }

  /**************************************/
  /*          字段提示逻辑                */
  /**************************************/
  // 查找targetNode节点同级，是否存在表名，确定是否要继续进行【字段提示】
  let parentNode = null;
  const depth = targetNode.ruleStack.length;
  for (let i = depth - 1; i >= 0; i--) {
    if (targetNode.ruleStack[i].name === SyntaxKind.joinPart) {
      parentNode = _findLast(targetNode.ruleStack.slice(0, i), {
        name: SyntaxKind.fromClause,
      });
      break;
    }

    parentNode = getFilteredNode(
      targetNode.ruleStack[i],
      target => target.name === SyntaxKind.fromClause || target.name === SyntaxKind.tableName,
    )[0];
    /** 查找最近的fromClause，但是不能超出当前子查询范围，避免定位到祖先的from */
    if (
      [SyntaxKind.queryStatement, SyntaxKind.fromStatement].includes(targetNode.ruleStack[i].name)
    ) {
      break;
    }

    if (parentNode) {
      break;
    }
  }

  if (!parentNode) {
    // find nothing, return null
    return;
  }

  // insert等场景
  if (parentNode.name === SyntaxKind.tableName) {
  }

  /**
   * @desc 基于fromClause场景
   * @case1 多表或子查询，提示表名或别名
   * @case2 单表，提示字段名
   * @case3 单子查询，提示子查询内字段名
   */
  let tableSrc = parentNode.children['FROM']
    ? getTableDetails({}, parentNode, SyntaxKind, true)
    : [];

  const ruleStacks = _get(targetNode, 'ruleStack').map(r => r.name);
  // query语句，函数情况下，特殊处理一次
  const autoCompelete = getAutoCompelete(ruleStacks);

  // 当targetNode.children为空，是解析时未输入的场景。空格触发
  if ((targetNode.children && _isEmpty(targetNode.children)) || autoCompelete) {
    /** @case2 单表，单子查询场景 */
    if (tableSrc.length === 1 && !tableSrc[0].alias) {
      const query = `${tableSrc[0].table}.`;
      // 子查询场景
      if (query === 'SUBQUERY.') {
        const fieldsList = _get(tableSrc, '[0].exportsFields', []);
        return {
          items: fieldsList.map(field => {
            /** 设置别名后，则不显示原始字段名 */
            const text = field.alias ? field.alias : field.name;
            return formatLabel(text, completionTypes, field.alias);
          }),
          type: CompleteType.field,
        };
      }

      // 非子查询，就去异步查表
      return {
        keyword: query,
        type: CompleteType.field,
      };
    }

    /** @case1 多表场景 */
    return {
      type: CompleteType.field,
      items: tableSrc.map(table => {
        if (table.table !== 'SUBQUERY' && !table.alias) {
          /** TODO: 如何缓存表名 */
          return generateCompleteItem(table.table, [], false, {
            detail: completionTypes.TABLE.text,
            builtInCompletionType: builtInCompletionType.TABLE,
            kind: completionTypes[builtInCompletionType.TABLE].kind,
          });
        }
        // 子查询无别名的场景，不需要提示，因为语法不支持
        return generateCompleteItem(table.alias, [], false, {
          detail: completionTypes.TABLEALIAS.text,
          builtInCompletionType: builtInCompletionType.TABLEALIAS,
          kind: completionTypes[builtInCompletionType.TABLEALIAS].kind,
        });
      }),
    };
  }

  // 非空场景，就是存在前缀了，需要进一步的计算。如：table.

  // 结尾不是点 且 规则名不是dottedColumnId的话，不是匹配别名逻辑，返回为空。
  // const isColumn =
  //   targetNode?.image?.endsWith('.') &&
  //   targetNode.ruleStack.slice(-1)[0].name === SyntaxKind.dottedColumnId;
  
  // if (!isColumn) {
  //   return;
  // }

  const columnPath = getCompletePath(targetNode.ruleStack.slice(-2)[0]);
  /** 路径中的任何位置都有可能出现别名，找打并替换成正确路径 */
  const originPath = columnPath.split('.').filter(Boolean);

  const aliasPath = originPath.reduce((sum, item) => {
    const findItem = deepFind(tableSrc, o => o.alias === item || o.table === item)[0] || {};
    return [...sum, findItem];
  }, []);

  // 可能存在别名，
  if (originPath.length === 1) {
    const lastTableInfo = aliasPath.slice(-1)[0];
    // 通过别名搜索到了子查询
    if (lastTableInfo.table === 'SUBQUERY') {
      const fieldsList = _get(lastTableInfo, 'exportsFields', []);
      const subQuryStarField = fieldsList.find(fi => fi.name === '*');

      // 子查询是 * 则用子查询的表名去查。FIXME 嵌套子查询没做
      if (subQuryStarField) {
        const keyword = `${subQuryStarField.origin}${targetNode.image}`; // tableName.
        return {
          keyword,
          type: CompleteType.field,
        };
      }

      return {
        type: CompleteType.field,
        items: _flattenDeep(
          fieldsList.map((field: any) => {
            /** 设置别名后，则不显示原始字段名 */
            const text = field.alias ? field.alias : field.name;
            return formatLabel(text, completionTypes, field.alias);
          }),
        ),
      };
    }

    // 非子查询,但是找到别名了
    if (!_isEmpty(lastTableInfo)) {
      const tablename = lastTableInfo.table;

      if (lastTableInfo.availableFields[0].name === '*') {
        return {
          keyword: tablename,
          type: CompleteType.field,
        };
      } else {
        // 待确定是否存在，表名但是有输入名字的情况
        return {
          type: CompleteType.field,
          items: _flatten(
            lastTableInfo.availableFields.map(field => {
              const text = field.alias ?? field.name;
              return formatLabel(text, completionTypes, !!field.alias);
            }),
          ),
        };
      }
    }
  }

  /** 在构建的tableSrc中没有的场景，就是用户自己写的表名查询 */
  // 将originPath中的别名，替换成对应的表名
  let finalPath = aliasPath.reduce((sum, item, idx) => {
    if (item?.alias && item.table !== 'SUBQUERY') {
      return sum + item.table;
    } else {
      return `${sum ? sum + '.' : sum}${originPath[idx]}`;
    }
  }, '');

  if (targetNode.image === '.') {
    /** 输入‘.’自动补全场景时，路径尾部需要补全一个‘.’，输入keyword补全时，则不需要补全‘.’ */
    finalPath += '.';
  }
  /** from后面仅有一个表名时，无需补全表名，可以认为用户在输入字段名，而此时keyword需要加上表名等信息 */
  // 如果字段中已经呆了表名，那么久不需要补充
  if (tableSrc.length === 1 && !finalPath.includes(tableSrc[0].table)) {
    finalPath = `${tableSrc[0].table}.${finalPath}`;
  }

  return {
    keyword: finalPath,
    type: CompleteType.field,
  };
}

/**
 * Parser调度管理
 */
export class ParserManage {
  /**上一次解析的code */
  private prevCode;

  /** 解析器 */
  public parser: Function;

  /** 当前等待解析的列表 */
  private parseList: Array<any> = [];

  /** 上次解析生成的ast */
  private prevAst = null;

  /** 是否正在解析 */
  private isParsering = false;

  constructor(parser: Function) {
    this.parser = parser;
  }

  parse(code: string, ...rest) {
    let parserPromise;
    // 如果已经存在进行中的解析
    if (this.isParsering) {
      if (code === this.prevCode) {
        parserPromise = this.createParserPromise();
      } else {
        parserPromise = this.changeCode(code, ...rest);
      }
    } else {
      if (code === this.prevCode) {
        parserPromise = Promise.resolve(this.prevAst);
      } else {
        parserPromise = this.changeCode(code, ...rest);
      }
    }
    return parserPromise;
  }

  private createParserPromise() {
    return new Promise((resolve, reject) => {
      this.parseList.push({
        resolve,
        reject,
      });
    });
  }

  private changeCode(code, ...rest) {
    this.prevCode = code;
    const parsePromise = this.createParserPromise();
    this.isParsering = true;
    setTimeout(() => {
      this.parseTask(code, ...rest);
    }, 0);
    return parsePromise;
  }

  /** 解析任务 */
  private async parseTask(code: string, ...rest) {
    const ast = this.parser(code, ...rest);
    this.prevAst = ast;
    this.flush(ast);
    this.isParsering = false;
  }

  /** 清空待解析列表 */
  private flush(ast) {
    for (let item of this.parseList) {
      item.resolve(ast);
    }
    this.parseList = [];
  }
}

export const getFunctionDetail = (funcName: string) => {
  // 先转为大写
  const funcNameUpperCase = funcName.toUpperCase();
  let result;

  // 重名时提示优先级按: 聚合函数 > 复杂函数 > 数学函数 > 其他函数 > 字符串函数 > 日期函数 > 窗口函数
  result = AGGR_FUNCTIONS[funcNameUpperCase];

  if (!result) {
    result = COMPLEX_FUNCTIONS[funcNameUpperCase];
  }

  if (!result) {
    result = MATH_FUNCTIONS[funcNameUpperCase];
  }

  if (!result) {
    result = OTHER_FUNCTIONS[funcNameUpperCase];
  }

  if (!result) {
    result = STRING_FUNCTIONS[funcNameUpperCase];
  }

  if (!result) {
    result = DATE_FUNCTIONS[funcNameUpperCase];
  }

  if (!result) {
    result = RANGE_FUNCTIONS[funcNameUpperCase];
  }

  return result;
};

interface AssistanceToken {
  image: string;
  startColumn: number;
  startLine: number;
  tokenType: any;
  tokenTypeIdx: number;
}

export const calculateHoverFuncName = (
  assistanceTokenVector: AssistanceToken[],
  position: ls.Position,
) => {
  let funcName;
  let funcToken;
  let nextToken;
  const { line, character } = position;
  const actualLine = line + 1;
  const actualChar = character + 1;
  const list = assistanceTokenVector.filter(item => item.startLine === actualLine);

  list.forEach((item, index) => {
    if (
      actualChar >= item.startColumn &&
      actualChar < list[index + 1]?.startColumn &&
      list[index + 1].image === '('
    ) {
      funcName = item.image;
      funcToken = item;
      nextToken = list[index + 1];
    }
  });

  return { funcName, funcToken, nextToken };
};
