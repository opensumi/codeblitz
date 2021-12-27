/* copied from antcode */
export * from './annotation';
export * from './check-suite';
export * from './note';
export * from './file-action';
export * from './diff';

import { Diff, DiffOverview } from './diff';

/* convert antcode type to our own types */
export type IPullRequestChange = Diff;
export type IPullRequestChangeOverview = DiffOverview;
export type IPullRequestChangeList = Diff[] | DiffOverview[];
// type trick for union array
export type IPullRequestChangeItem = IPullRequestChange | IPullRequestChangeOverview;

export function isPullRequestChangeOverview(
  d: IPullRequestChange | IPullRequestChangeOverview
): d is IPullRequestChangeOverview {
  return (
    !!(d as IPullRequestChange & IPullRequestChangeOverview).id &&
    !(d as IPullRequestChange & IPullRequestChangeOverview).diff
  );
}
