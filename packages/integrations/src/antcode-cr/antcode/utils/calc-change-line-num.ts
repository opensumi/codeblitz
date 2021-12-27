import { Diff } from '../types/diff';

export function calcChangeLineNum(diffs: Diff[]) {
  let addLineNum = 0;
  let delLineNum = 0;
  for (const diff of diffs) {
    if (diff.tooLarge) {
      continue;
    }
    const addition = diff.diff.match(/^\+/gm)?.length ?? 0;
    const deletion = diff.diff.match(/^-/gm)?.length ?? 0;
    diff.addLineNum = addition;
    diff.delLineNum = deletion;
    addLineNum += addition;
    delLineNum += deletion;
  }
  return {
    addLineNum,
    delLineNum,
  };
}
