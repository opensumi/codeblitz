import { kExtensionConfig, resolveFrameworkPath } from './constant';
import { log } from './log';

export default function checkFramework() {
  const frameworkPath  = resolveFrameworkPath();
  if (!frameworkPath) {
    log.error(`cli 无法单独使用，需要与 ${kExtensionConfig.frameworkPackageName} 一起安装使用`);
    throw new Error('error');
  }
}
