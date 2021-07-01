import { SHA1 } from 'crypto-js';
import { IComment } from '../antcode-service/base';

export class LineNum {
  constructor(public del: number, public add: number) {}
}

export const LINE_NUMBER_PATTERN = /\.*@@\s*-(\d+).*\+(\d+).*\s*@@/;

// @@ -362,14 +250,10 @@
// 左边编辑器在 362 行变更，变更 14 行，右边编辑器在 250 行处变更，变更 10 行
export const DIFF_CHANGE_LINE_PATTERN = /\.*@@\s*-(\d+),(\d+).*\+(\d+),(\d+).*\s*@@/;

export function isBlank(str: string | null): boolean {
  return str === null || str.trim() === '';
}

/**
 * 查找评论在左边还是在右边
 * @param diff
 * @param left 左行号
 * @param right 右行号
 * @return -1 为左，1 为右
 */
export function getSide(diff: string, left: number, right: number): number {
  if (left === 0) {
    return 1;
  } else if (right === 0) {
    return -1;
  }
  let del = 0,
    add = 0;
  const diffs = diff.split('\n');
  for (const idx in diffs) {
    const line = diffs[idx];
    if (line.startsWith('@@')) {
      const matcher = LINE_NUMBER_PATTERN.exec(line);
      if (matcher) {
        del = parseInt(matcher[1], 10);
        add = parseInt(matcher[2], 10);
        continue;
      }
    }
    if (line.startsWith('+')) {
      if (del === left && add === right) {
        return 1;
      }
      add++;
      continue;
    }
    if (line.startsWith('-')) {
      if (del === left && add === right) {
        return -1;
      }
      del++;
      continue;
    }
    if (del === left && add === right) {
      return -1;
    }
    del++;
    add++;
  }
  return -1;
}

/**
 * 根据左行号查找
 * @param diff
 * @param right
 * @return
 */
export function findByRight(diff: string, right: number): LineNum | undefined {
  let del = 0,
    add = 0;
  const diffs = diff.split('\n');
  for (const line of diffs) {
    if (isBlank(line)) {
      if (right < add) {
        return new LineNum(del, add - 1);
      }
      del++;
      add++;
      continue;
    }
    if (line.startsWith('@@')) {
      const matcher = LINE_NUMBER_PATTERN.exec(line);
      if (matcher) {
        del = parseInt(matcher[1], 10);
        add = parseInt(matcher[2], 10);
        if (right < add) {
          return;
        }
        continue;
      }
    }

    if (line.startsWith('+')) {
      if (right < add) {
        return new LineNum(del, add - 1);
      }
      add++;
      continue;
    }

    if (line.startsWith('-')) {
      if (right < add) {
        return new LineNum(del - 1, add - 1);
      }
      del++;
      continue;
    }
    if (right < add) {
      return new LineNum(del, add - 1);
    }
    del++;
    add++;
  }
  return add < right ? undefined : new LineNum(del, add > 2 ? add - 1 : add);
}

export function findByLeft(diff: string, left: number): LineNum | undefined {
  let del = 0,
    add = 0;
  const diffs = diff.split('\n');
  for (const line of diffs) {
    if (isBlank(line)) {
      if (left === del) {
        return new LineNum(del, add);
      }
      del++;
      add++;
      continue;
    }
    if (line.startsWith('@@')) {
      const matcher = LINE_NUMBER_PATTERN.exec(line);
      if (matcher) {
        del = parseInt(matcher[1], 10);
        add = parseInt(matcher[2], 10);
        if (left < del) {
          return;
        }
        continue;
      }
    }
    if (line.startsWith('+')) {
      add++;
      continue;
    }
    if (line.startsWith('-')) {
      if (left === del) {
        return new LineNum(del, add);
      }
      del++;
      continue;
    }
    if (left === del) {
      return new LineNum(del, add);
    }
    del++;
    add++;
  }
}

export function lineCodeBuilder(path: string, lineNum: LineNum): string | undefined {
  try {
    return `${SHA1(path)}_${lineNum.del}_${lineNum.add}`;
  } catch (e) {
    // NOOP
  }
}

export function genLineCode(diff: string, path: string, line: number, isOriginal: boolean) {
  let lineNumber = isOriginal ? findByLeft(diff, line) : findByRight(diff, line);
  // 如果当前评论位置不在变更行中，则判断当前评论位置如果在左侧则将行号赋值给左侧，右侧为空，反之亦然
  if (!lineNumber) {
    lineNumber = isOriginal ? new LineNum(line, 0) : new LineNum(0, line);
  }
  return lineCodeBuilder(path, lineNumber);
}

export function isProblem(comment: IComment) {
  return comment.type === 'Problem' && comment.state !== 'resolved';
}

function toRange(startLineNumber: number, endLineNumber: number) {
  return {
    startLineNumber,
    endLineNumber,
    startColumn: 1,
    endColumn: 1,
  };
}

export function getChangeRangeByDiff(diff: string, isLeft: boolean) {
  const ranges = [];
  const diffs = (diff || '').split('\n');
  for (const line of diffs) {
    if (line.startsWith('@@')) {
      const matcher = DIFF_CHANGE_LINE_PATTERN.exec(line);
      if (matcher) {
        let startLineNumber, endLineNumber;
        if (isLeft) {
          startLineNumber = parseInt(matcher[1], 10);
          endLineNumber = startLineNumber + parseInt(matcher[2], 10) - 1;
        } else {
          startLineNumber = parseInt(matcher[3], 10);
          endLineNumber = startLineNumber + parseInt(matcher[4], 10) - 1;
        }
        // @ts-ignore
        ranges.push(toRange(startLineNumber, endLineNumber));
      }
    }
  }
  return ranges;
}

export function isChangeLineRelated(
  comment: IComment,
  leftLineNumber: number,
  rightLineNumber: number
) {
  // 如果没有 diff 信息则拦掉
  const change = comment.stDiff;
  if (!change) {
    return false;
  }

  // 重命名: follow antcode 逻辑, 不算变更行 (因为 antcode 压根不渲染这些内容)
  if (change.renamedFile) {
    return false;
  }

  // 新增|删除: 只有要评论都算跟变更行关联的逻辑
  if (change.deletedFile || change.newFile) {
    return true;
  }

  const diffStr = change.diff;

  if (getSide(diffStr, leftLineNumber, rightLineNumber) < 0) {
    // -1 为左边，找到行号则认为是变更行
    return !!findByLeft(diffStr, leftLineNumber);
  } else {
    // 1 为有边，同样是找到行号则认为是变更行
    return !!findByRight(diffStr, rightLineNumber);
  }
}
