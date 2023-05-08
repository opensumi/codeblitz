/**
 * @file 校验groupby，相关的规则
 * @author zuoyi
 */
import { CstNode, IToken } from 'chevrotain/lib/chevrotain.d';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver-types';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _flatten from 'lodash/flatten';
import {
  peelCstToAtomQuerys,
  buildRange,
  ValidationRules,
  peelFromClauseToTableName,
  cstFind,
} from './define';

export const validateSelectAll = (cst: CstNode): Diagnostic[] => {
  // 获取原子Select语句，将Union内的查询打平
  const atomQueryExpressions = peelCstToAtomQuerys(cst);

  // 过滤出使用*的原子语句
  return atomQueryExpressions.reduce((starImages, atom) => {
    const selectItems =
      cstFind(atom, ['selectClause', 'selectSpec', 'selectList', 'selectItem']) || [];

    const allStar = selectItems
      .map(item => cstFind(item, ['tableAllColumns', 'STAR[0]']))
      .filter(Boolean);

    // 如果存在*，则找到该原子select下的所有的表名
    const code = !_isEmpty(allStar)
      ? peelFromClauseToTableName(_get(atom, 'children.fromClause[0]'), false, true)
      : '';

    // 将image对象，修改成monaco.editor.IMarkData[] 用于界面上显示
    const starMarks = (allStar || []).map(star => {
      const starRange = buildRange(star);
      return {
        range: starRange,
        message: 'select * is not recommended',
        severity: DiagnosticSeverity.Warning,
        code,
        source: ValidationRules.SELECT_STAR,
      };
    });

    return starImages.concat(starMarks);
  }, []);
};
