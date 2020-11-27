import { Injectable, Autowired } from '@ali/common-di';
import { Uri } from '@ali/ide-core-common';
import { ExtraMetaData } from '@ali/ide-kaitian-extension/lib/common';
import type { IExtensionNodeClientService, IExtensionMetaData } from './common';
import { AppConfig } from '../core/app';
import { getExtensionPath } from '../../common/util';

@Injectable()
export class ExtensionServiceClientImpl implements IExtensionNodeClientService {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  getElectronMainThreadListenPath(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async getAllExtensions(
    scan: string[],
    extensionCandidate: string[],
    localization: string,
    extraMetaData: ExtraMetaData
  ): Promise<IExtensionMetaData[]> {
    const { extensionMetadata } = this.appConfig;
    if (!extensionMetadata?.length) {
      return [];
    }
    const extensions = await Promise.all(
      extensionMetadata.map(async (ext) => {
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
      })
    );

    return extensions;
  }
  createProcess(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getExtension(): Promise<IExtensionMetaData | undefined> {
    throw new Error('Method not implemented.');
  }
  infoProcessNotExist(): void {
    throw new Error('Method not implemented.');
  }
  infoProcessCrash(): void {
    throw new Error('Method not implemented.');
  }
  disposeClientExtProcess(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateLanguagePack(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
