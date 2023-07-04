/**
 * @file 枚举
 * @author zuoyi
 */
import { CstNode, IToken } from 'chevrotain/lib/chevrotain.d';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _flatten from 'lodash/flatten';
import { ValidationRules } from '../../types';

export { ValidationRules };

export const AggregateFuncNames = [
  'AVG',
  'COUNT',
  'COUNT_IF',
  'MAX',
  'MIN',
  'MEDIAN',
  'STDDEV',
  'STDDEV_SAMP',
  'SUM',
  'WM_CONCAT',
  'ANY_VALUE',
  'APPROX_DISTINCT',
  'ARG_MAX',
  'ARG_MIN',
  'COLLECT_LIST',
  'COLLECT_SET',
  'COVAR_POP',
  'COVAR_SAMP',
  'NUMERIC_HISTOGRAM',
  'PERCENTILE',
  'PERCENTILE_APPROX',
  'VARIANCE/VAR_POP',
  'VAR_SAMP',
];

/** 获取原子Select语句，将Union、子查询等场景下的原子Select语句打平存储 */
const flatternAtomQueryExpression = (selectQueryStatements: CstNode) => {
  const selectQueryStatementsChildrens: any = _get(selectQueryStatements, 'children', {});
  const ans: any = [];
  if (selectQueryStatementsChildrens.atomQueryExpression) {
    // 递归盘剥From语句后面的子查询
    const fromTableSources = _get(
      selectQueryStatementsChildrens.atomQueryExpression[0],
      'children.fromClause[0].children.tableSources[0].children.tableSource',
      [],
    );
    fromTableSources.forEach(tableSource => {
      const subQueryState = _get(
        tableSource,
        'children.fromSource[0].children.subQuerySource[0].children.subQueryExpression[0].children.selectQueryStatement[0]',
      );
      if (subQueryState) {
        ans.push(...flatternAtomQueryExpression(subQueryState));
      }
    });
    // 保存当前的原子语句
    ans.push(selectQueryStatementsChildrens.atomQueryExpression[0]);
  }

  // union场景的盘剥
  // if (selectQueryStatementsChildrens.unionStatement) {
  //   selectQueryStatementsChildrens.unionStatement.forEach(unionSection => {
  //     const unionQueryState = _get(unionSection, 'children.selectQueryStatement[0]');
  //     if (unionQueryState) {
  //       ans.push(...flatternAtomQueryExpression(unionQueryState)); // 递归解析
  //     }
  //   });
  // }

  return ans;
};

/** 将cstNode节点下所有的关键词提取 */
export const getLeafImage = (cst: CstNode | IToken): IToken[] => {
  const queue = [cst];
  const res: any[]  = [];
  while (queue.length > 0) {
    const c = queue.shift();
    if ((c as IToken)?.image) {
      res.push(c as IToken);
    } else if (c) {
      queue.push(..._flatten(Object.values((c as CstNode).children)) as CstNode[]);
    }
  }
  return res;
};

const memorizeOnce = fn => {
  const cacheLast = new Map();
  return (...args) => {
    const key = args[0];
    if (cacheLast.get(key)) return cacheLast.get(key);

    const ans = fn(...args);
    // 只缓存一次，不生效就丢弃。。因为每次构建的cst都肯定不一样。
    cacheLast.clear();
    cacheLast.set(key, ans);
    return ans;
  };
};

/** 将cstNode节点构建Range结构 */
export const buildRange = (start: IToken, end?: IToken) => {
  const endImage = end || start;
  return {
    start: { line: start.startLine|| 1 - 1, character: start.startColumn|| 1 - 1 },
    end: {
      line: endImage.startLine|| 1 - 1,
      character: endImage.startColumn||1 + endImage.image.length - 1,
    },
  };
};

const findExactStatementFromCst = (cst: CstNode, path: string, preserve?: boolean) => {
  // 获取完整SQL语句
  const sqlStatements = _get(cst, 'children.sqlStatements', []);
  const statementCst: CstNode[] = sqlStatements
    .map(sqlRule => {
      return _get(sqlRule, path);
    });


    if (preserve) {
      return statementCst;
    } else {
      return statementCst.filter(Boolean);
    }
};

/** 将CST打平成原子 Select语句 */
export const peelCstToAtomQuerys: (params: CstNode) => CstNode[] = memorizeOnce((cst: CstNode) => {
  const selectQueryStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.queryInsertStatement[0].children.queryStatement[0].children.selectQueryStatement[0]',
  );
  // 获取原子Select语句，将Union内的查询打平
  const atomQueryExpressions = selectQueryStatements.reduce(
    (total, item) => total.concat(flatternAtomQueryExpression(item)),
    [],
  );

  return atomQueryExpressions;
});

// CST 打平成 Select 语句，但是也不屏蔽其他类型语句的存在
export const peelCstToAtomQuerysWithOtherType: (params: CstNode) => CstNode[] = memorizeOnce((cst: CstNode) => {
  const selectQueryStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.queryInsertStatement[0].children.queryStatement[0].children.selectQueryStatement[0]',
    true
  );
  // 获取原子Select语句，将Union内的查询打平
  const atomQueryExpressions = selectQueryStatements.reduce(
    (total, item) => total.concat(item ? flatternAtomQueryExpression(item) : item),
    [],
  );

  return atomQueryExpressions;
});

export const findDeleteStatementFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const deleteStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.deleteStatement[0]',
  );
  return deleteStatements;
};

export const findInsertIntoFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const insertStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.queryInsertStatement[0].children.insertStatement[0].children.insertIntoClause[0]',
  );

  return insertStatements;
};

export const findInsertOverWriteFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const insertStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.queryInsertStatement[0].children.insertStatement[0].children.insertOverWriteClause[0].children.destination[0]',
  );

  return insertStatements;
};

export const findUpdateFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const updateStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.updateStatement[0]',
  );

  return updateStatements;
};

export const findAlterFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const alterStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.ddlStatement[0].children.alterStatement[0]',
  );
  return alterStatements;
};

export const findDropFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const dropStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.ddlStatement[0].children.dropStatement[0].children.dropTableStatement[0]',
  );
  return dropStatements;
};

export const findTruncateFromCst: (cst: CstNode) => CstNode[] = (cst: CstNode) => {
  const truncateStatements = findExactStatementFromCst(
    cst,
    'children.execStatement[0].children.ddlStatement[0].children.useLessAbstractPart[0].children.truncateTableStatement[0]',
  );
  return truncateStatements;
};

/** 链式汲取cst中特定规则 */
export const cstFind = (cst: CstNode, chain: string[]) => {
  return chain.reduce((ans, path, index) => {
    if (index === chain.length - 1) return _get(ans, `children.${path}`);
    return _get(ans, `children.${path}[0]`);
  }, cst);
};

/**
 * 已明确 CSTNode[] 的情况下
 * 根据 CSTNode 组合完整的 image作为 image, 比如 tablename.fieldA
 * 如需要返回位置 取此 CSTNode 下第一个叶子的位置作为返回
 */
export const getCstNodesInfo = (
  nodeList: CstNode[],
  withPosition?: boolean,
  aliasList?: CstNode[],
) => {
  if (withPosition) {
    // 查询字段名的同时带上当前字段的位置信息
    const ans = nodeList.map((node, index) => {
      const leafImage = getLeafImage(node).sort((a, b) => a.startOffset - b.startOffset);
      const nodeNameStr = leafImage.map(({ image }) => image).join('');
      const tableNameAlias = aliasList?.[index] && getLeafImage(aliasList[index])[0]?.image;
      return {
        ...leafImage[0],
        image: tableNameAlias ? `${nodeNameStr}-alias-${tableNameAlias}` : nodeNameStr
      };
    });
    return ans;
  }

  let ans;

  if (!aliasList) {
    ans = nodeList
      .map(nodeItem => {
        return getLeafImage(nodeItem)
          .sort((a, b) => a.startOffset - b.startOffset)
          .map(({ image }) => image)
          .join('');
      })
      .join(',');
  } else {
    // 如果一个表有表别名，需要返回成 tablename-alias-tablealias 这种形式
    ans = nodeList
      .map(nodeItem => {
        return getLeafImage(nodeItem)
          .sort((a, b) => a.startOffset - b.startOffset)
          .map(({ image }) => image)
          .join('');
      })
      .map((tableName, index) => {
        // 有 alias 需要拼接
        if (aliasList[index]) {
          return `${tableName}-alias-${getLeafImage(aliasList[index])[0]?.image}`;
        }
        // 没有就直接返回表名
        return tableName;
      })
      .join(',');
  }

  return ans;
};

/** 从 fromClause 盘剥成具体的表名，不支持子查询嵌套深度查询 */
export const peelFromClauseToTableName = (
  fromClause,
  withPosition?: boolean,
  withAlias?: boolean,
) => {
  const tableSource = cstFind(fromClause, ['tableSources', 'tableSource']);
  const tableNamesArr: any[] = [];

  tableSource?.forEach(source => {
    if (cstFind(source, ['fromSource'])) {
      tableNamesArr.push(_get(source, 'children.fromSource[0]'));
    }
    if (cstFind(source, ['joinPart'])) {
      const fromSources = _get(source, 'children.joinPart', []).map(joinpart => {
        return _get(joinpart, 'children.fromSource[0]', {});
      });
      tableNamesArr.push(...fromSources);
    }
  });

  // 不考虑表别名的场景
  if (!withAlias) {
    // fromSource中支持子查询、纯表名、虚拟表【values(name, id)】，目前只支持纯表名
    const filteredTableNameArr = tableNamesArr
      .map(fromSource => {
        return cstFind(fromSource, ['tableSourceItem', 'tableName[0]']);
      })
      .filter(Boolean);

    const ans = getCstNodesInfo(filteredTableNameArr, withPosition);

    return ans;
  } else {
    const tableNameArr: any[] = [];
    const tableAliasArr: any[] = [];

    tableNamesArr.forEach(fromSource => {
      const tableName = cstFind(fromSource, ['tableSourceItem', 'tableName[0]']);
      if (tableName) {
        // 不管有没有查到 alias，都 push 一份 alias，保持 name 和 alias 的一致性
        const tableAlias = cstFind(fromSource, ['tableSourceItem', 'alias', 'uid[0]']);
        tableNameArr.push(tableName);
        tableAliasArr.push(tableAlias);
      }
    });

    const ans = getCstNodesInfo(tableNameArr, withPosition, tableAliasArr);

    return ans;
  }
  // 考虑表别名场景
};

// 从 `原子查询` 语句 cst 中汲取 字段名以及位置信息
export const peelAtomQueryCstToFieldNames = (atomQueryCst: CstNode, withPosition?: boolean) => {
  const selectItems =
    cstFind(atomQueryCst, ['selectClause', 'selectSpec', 'selectList', 'selectItem']) || [];
  // 普通 select
  const allSelectFieldsArr = selectItems.map(item => 
    {
       // 字段出现在函数参数中
      const isFunc = !!cstFind(item, ['funcBody', 'selectExpressionList[0]']);

      if (!isFunc) {
        return cstFind(item, ['fullId[0]']) || cstFind(item, ['tableAllColumns', 'STAR[0]'])
      }

      const funcParams = cstFind(item, ['funcBody', 'selectExpressionList', 'selectExpression'])
      const params = funcParams.map(param => {
        const result = cstFind(param, ['expression', 'logicalExpression', 'expressionRecursionPart', 'mathExpression', 'atomExpression', 'fullId[0]']) || cstFind(param, ['STAR[0]'])
        return result;
      });
      return params;
    }
  ).filter(item => {
    if (Array.isArray(item)) {
      return item.length >= 1;
    }
    return item;
  });

  // 函数多个参数，拍平
  const fieldsResult = _flatten(allSelectFieldsArr) as CstNode[];

  const ans = getCstNodesInfo(fieldsResult, withPosition); 

  return ans;
};
