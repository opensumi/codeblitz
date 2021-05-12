import { ExtensionServiceImpl } from '@ali/ide-kaitian-extension/lib/browser/extension.service';

// TODO：待 kaitian 中去掉，临时覆盖掉实现，这样 loader 可移除了
ExtensionServiceImpl.prototype.initCommonBrowserDependency = () => Promise.resolve();
ExtensionServiceImpl.prototype.initKaitianBrowserAPIDependency = () => Promise.resolve();
