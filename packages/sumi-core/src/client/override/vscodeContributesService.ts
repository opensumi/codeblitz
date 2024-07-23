import { VSCodeContributePoint } from '@opensumi/ide-extension';
import {
  VSCodeContributesService,
  VSCodeContributesServiceToken,
} from '@opensumi/ide-extension/lib/browser/vscode/contributes';
import { BreakpointsContributionPoint } from '@opensumi/ide-extension/lib/browser/vscode/contributes/breakpoints';
import { DebuggersContributionPoint } from '@opensumi/ide-extension/lib/browser/vscode/contributes/debuggers';
import { TerminalContributionPoint } from '@opensumi/ide-extension/lib/browser/vscode/contributes/terminal';

export { VSCodeContributesServiceToken };

// Codeblitz 内不需要的初始化贡献点
const OUTSIDE_POINT = [
  TerminalContributionPoint,
  DebuggersContributionPoint,
  BreakpointsContributionPoint,
] as (typeof VSCodeContributePoint)[];

export class VSCodeContributesServiceOverride extends VSCodeContributesService {
  constructor() {
    super();
    this.ContributionPoints = this.ContributionPoints.filter((t) => {
      return !OUTSIDE_POINT.includes(t);
    });
  }
}
