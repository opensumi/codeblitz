import * as React from 'react';
import { IPullRequestChangeDiff } from '../../../antcode-service/base';

function getBadgeText(change: IPullRequestChangeDiff) {
  if (change.newFile) {
    return 'A';
  } else if (change.deletedFile) {
    return 'D';
  } else if (change.renamedFile) {
    return 'R';
  } else {
    const result = [];
    if (change.delLineNum) {
      // @ts-ignore
      result.push(`-${change.delLineNum}`);
    }
    if (change.addLineNum) {
      // @ts-ignore
      result.push(`+${change.addLineNum}`);
    }
    return result.join(',') + ' M';
  }
}

function getBadgeColor(change: IPullRequestChangeDiff) {
  if (change.newFile) {
    return 'var(--kt-decoration-addedResourceForeground)';
  } else if (change.deletedFile) {
    return 'var(--kt-decoration-deletedResourceForeground)';
  } else {
    return 'var(--kt-decoration-modifiedResourceForeground)';
  }
}

export const ChangeBadge: React.FC<IPullRequestChangeDiff> = (props) => {
  const badgeText = getBadgeText(props);
  const badgeColor = getBadgeColor(props);
  return <span style={{ color: badgeColor }}>{badgeText}</span>;
};
