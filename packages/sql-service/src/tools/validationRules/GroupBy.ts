/**
 * @file 校验groupby，相关的规则
 * @author zuoyi
 */
import { CstNode, IToken } from 'chevrotain/lib/chevrotain.d';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver-types';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _flatten from 'lodash/flatten';
import _uniqWith from 'lodash/uniqWith';
import {
  AggregateFuncNames,
  peelCstToAtomQuerys,
  getLeafImage,
  buildRange,
  ValidationRules,
} from './define';

/**
 * 1. 校验select后非聚合字段数量，与groupby后的字段数量是否一致
 * 2. groupby不与distinct同时存在
 */
export const validateGroupBy = (cst: CstNode): Diagnostic[] => {
  // 收集所有异常case
  let errorMarks = [] as Diagnostic[];

  // 获取原子Select语句，将Union内的查询打平
  const atomQueryExpressions = peelCstToAtomQuerys(cst);
  // 筛选包含groupby的原子select语句
  const groupbyQueryExpression = atomQueryExpressions.filter(node =>
    _get(node, 'children.preSelectClauses[0].children.groupByClause'),
  );
  // 存在groupby的原子select，进一步分析字段数量比较
  if (!_isEmpty(groupbyQueryExpression)) {
    // 盘剥groupby的字段，与SelectItems字段数量比较
    groupbyQueryExpression.forEach(atomQuery => {
      // 获取groupby字段个数
      const groupbyClause = _get(
        atomQuery,
        'children.preSelectClauses[0].children.groupByClause[0].children.expressionsNotInParenthese[0]',
      );
      const groupbyItems = getLeafImage(groupbyClause);
      // 计算selectItem个数
      const selectSpec = _get(atomQuery, 'children.selectClause[0].children.selectSpec[0]');
      const selectItems = _get(selectSpec, 'children.selectList[0].children.selectItem', [])
        .map(item => {
          return getLeafImage(item);
        })
        .map(tokens => {
          return tokens
            .sort((a, b) => a.startOffset - b.startOffset)
            .map(({ image }) => image)
            .join('');
        });

      const { GROUP, BY } = _get(
        atomQuery,
        'children.preSelectClauses[0].children.groupByClause[0].children',
      );
      const groupByRange = buildRange(GROUP[0], BY[0]);

      const notAggregateItems = selectItems.filter(stringItem => {
        const isAggregate = AggregateFuncNames.some(func => {
          return String(stringItem)
            .toUpperCase()
            .startsWith(func); // SQL中查询项，是否以聚合函数开头
        });
        return !isAggregate;
      });
      // 字段数量不对
      if (notAggregateItems.length !== groupbyItems.length) {
        errorMarks.push({
          range: groupByRange,
          message: 'Expression not in GROUP BY key',
          severity: DiagnosticSeverity.Error,
          source: ValidationRules.GROUP_BY,
        });
      }

      // 字段不一致
      for (let i = 0; i < notAggregateItems.length; i++) {
        if (notAggregateItems[i] !== groupbyItems[i]?.image) {
          errorMarks.push({
            range: groupByRange,
            message: 'Expression not in GROUP BY key',
            severity: DiagnosticSeverity.Error,
            source: ValidationRules.GROUP_BY,
          });
          break;
        }
      }

      const distinctImage = _get(selectSpec, 'children.DISTINCT[0]', {});

      // 存在distinct
      if (distinctImage && distinctImage.image) {
        const distinctRange = buildRange(distinctImage);
        errorMarks.push({
          range: groupByRange,
          message: 'SELECT DISTINCT and GROUP BY can not be in the same query',
          severity: DiagnosticSeverity.Error,
          source: ValidationRules.GROUP_BY,
        });
        errorMarks.push({
          range: distinctRange,
          message: 'SELECT DISTINCT and GROUP BY can not be in the same query',
          severity: DiagnosticSeverity.Error,
          source: ValidationRules.GROUP_BY,
        });
      }
    });
  }

  // 针对同样的位置出现同样的错误信息进行去重
  errorMarks = _uniqWith(errorMarks, (prev, next) => {
    return _isEqual(prev.range, next.range) && prev.message === next.message
  });

  return errorMarks;
};
