import { Injectable, Autowired } from '@ali/common-di';
import { Uri } from '@ali/ide-core-common';
import { IExtensionBasicMetadata } from '@alipay/alex-shared';
import { IExtensionNodeClientService, IExtensionMetadata, ExtraMetadata } from './base';
import { ServerConfig } from '../core/app';
import { getExtensionPath } from '../../common/util';

@Injectable()
export class ExtensionServiceClientImpl implements IExtensionNodeClientService {
  @Autowired(ServerConfig)
  serverConfig: ServerConfig;

  getElectronMainThreadListenPath(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async getAllExtensions(
    scan: string[],
    extensionCandidate: string[],
    localization: string,
    extraMetaData: ExtraMetadata
  ): Promise<IExtensionMetadata[]> {
    const { extensionMetadata } = this.serverConfig;
    if (!extensionMetadata?.length) {
      return [];
    }
    const extensions: IExtensionMetadata[] = await Promise.all(
      extensionMetadata.map((ext) => getExtension(ext, localization))
    );

    return extensions;
  }
  getExtension(
    extensionPath: string,
    localization: string,
    extraMetaData?: ExtraMetadata
  ): Promise<IExtensionMetadata | undefined> {
    const { extensionMetadata } = this.serverConfig;
    if (!extensionMetadata?.length) {
      return Promise.resolve(undefined);
    }
    const ext = extensionMetadata.find((ext) => getExtensionPath(ext.extension) === extensionPath);
    if (ext) {
      return getExtension(ext, localization);
    }
    return Promise.resolve(undefined);
  }
  createProcess(): Promise<void> {
    return Promise.resolve();
  }
  infoProcessNotExist(): void {
    return;
  }
  infoProcessCrash(): void {
    return;
  }
  disposeClientExtProcess(): Promise<void> {
    return Promise.resolve();
  }
  updateLanguagePack(): Promise<void> {
    return Promise.resolve();
  }
}

async function getExtension(ext: IExtensionBasicMetadata, localization: string) {
  // package.json 的 name 和 插件的 name 不是一回事
  const extensionPath = getExtensionPath(ext.extension);
  const extensionUri = Uri.parse(extensionPath);

  let pkgNlsJSON: { [key: string]: string } | undefined;
  if (localization.toLowerCase() === 'zh-cn') {
    pkgNlsJSON = ext.pkgNlsJSON['zh-CN'];
  } else if (localization.toLowerCase() === 'en-us') {
    pkgNlsJSON = ext.pkgNlsJSON['en-US'];
  } else {
    // 其它语言动态获取，估计基本用不到
    for (const { languageId, filename } of ext.nlsList) {
      const reg = new RegExp(
        `^${localization}|${localization.toLowerCase()}|${localization.split('-')[0]}$`
      );
      if (reg.test(languageId)) {
        try {
          const res = await fetch(
            extensionUri.with({ scheme: 'https' }).toString() + '/' + filename
          );
          if (res.status >= 200 && res.status < 300) {
            pkgNlsJSON = await res.json();
          }
        } catch (err) {}
        break;
      }
    }
  }

  return {
    id: `${ext.extension.publisher}.${ext.packageJSON.name}`,
    extensionId: `${ext.extension.publisher}.${ext.extension.name}`,
    packageJSON: ext.packageJSON,
    defaultPkgNlsJSON: ext.defaultPkgNlsJSON,
    packageNlsJSON: pkgNlsJSON,
    extraMetadata: {}, // 这个看框架代码，用的地方很少，应该用不到
    path: extensionPath,
    realPath: extensionPath,
    extendConfig: ext.extendConfig,
    isBuiltin: true,
    isDevelopment: false,
    uri: extensionUri,
  };
}