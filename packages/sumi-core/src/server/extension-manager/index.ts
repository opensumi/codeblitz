import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';

import { ExtensionManagerContribution } from './extension-manager.contribution';

/**
 * 后续考虑支持安装 worker 插件
 */

@Injectable()
export class ExtensionManagerModule extends NodeModule {
  providers = [ExtensionManagerContribution];
}
