import {
  VSCodeContributesServiceToken,
  VSCodeContributesService,
} from '@opensumi/ide-extension/lib/browser/vscode/contributes';
import { TerminalContributionPoint } from '@opensumi/ide-extension/lib/browser/vscode/contributes/terminal';

export { VSCodeContributesServiceToken };

// TODO Alex内暂时没有 Terminal 模块
// 去除 terminal 依赖项
export class VSCodeContributesServiceOverride extends VSCodeContributesService {
  constructor() {
    super();
  }
  ContributionPoints = [
    ...this.ContributionPoints.filter((contributtion) => {
      return contributtion.prototype.constructor !== TerminalContributionPoint;
    }),
  ];
}
