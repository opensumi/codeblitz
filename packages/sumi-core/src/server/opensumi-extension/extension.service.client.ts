import { IExtensionBasicMetadata } from '@codeblitzjs/ide-common';
import { Autowired, Injectable } from '@opensumi/di';
import { path, Uri } from '@opensumi/ide-core-common';
import { IExtensionLanguagePack } from '@opensumi/ide-extension/lib/common/vscode';
import { AppConfig } from '../../common';
import { EXT_SCHEME } from '../../common/constant';
import { getExtensionPath } from '../../common/util';
import { ServerConfig } from '../core/app';
import { ExtraMetadata, IExtensionMetadata, IExtensionNodeClientService } from './base';

const { posix } = path;

@Injectable()
export class ExtensionServiceClientImpl implements IExtensionNodeClientService {
  getLanguagePack(languageId: string): IExtensionLanguagePack | undefined {
    throw new Error('Method not implemented.');
  }

  pid(): Promise<number | null> {
    return Promise.resolve(2);
  }

  setupNLSConfig(languageId: string, storagePath: string): Promise<void> {
    return Promise.resolve();
  }

  getOpenVSXRegistry(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  @Autowired(ServerConfig)
  serverConfig: ServerConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig & { extensionOSSPath?: string };

  getElectronMainThreadListenPath(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async getAllExtensions(
    scan: string[],
    extensionCandidate: string[],
    localization: string,
    extraMetaData: ExtraMetadata,
  ): Promise<IExtensionMetadata[]> {
    const { extensionMetadata } = this.serverConfig;
    if (!extensionMetadata?.length) {
      return [];
    }
    const extensions: IExtensionMetadata[] = await Promise.all(
      extensionMetadata.map((ext) => getExtension(ext, localization, undefined, this.appConfig.extensionOSSPath)),
    );

    return extensions;
  }
  getExtension(
    extensionPath: string,
    localization: string,
    extraMetaData?: ExtraMetadata,
  ): Promise<IExtensionMetadata | undefined> {
    const { extensionMetadata } = this.serverConfig;
    if (!extensionMetadata?.length) {
      return Promise.resolve(undefined);
    }

    const ext = extensionMetadata.find(
      (ext) =>
        (ext.mode === 'local' && ext.uri ? ext.uri : getExtensionPath(ext.extension, ext.mode))
          === extensionPath,
    );
    if (ext) {
      return getExtension(ext, localization, extraMetaData);
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
  restartExtProcessByClient(): void {
    throw new Error('Method not implemented.');
  }
}

async function getExtraMetaData(
  webAssets: string[],
  extensionUri: Uri,
  localization: string,
  extraMetaData?: ExtraMetadata,
) {
  if (!extraMetaData) {
    return {};
  }
  const assetsMap = webAssets.reduce<Record<string, string>>((obj, field) => {
    obj[field.toLowerCase()] = field;
    return obj;
  }, {});
  const extensionExtraMetaData: Record<string, string | null> = {};
  for (const extraField of Object.keys(extraMetaData)) {
    try {
      const basename = posix.basename(extraMetaData[extraField]);
      const suffix = posix.extname(extraMetaData[extraField]).toLowerCase();
      const prefix = basename.substr(0, basename.length - suffix.length).toLowerCase();
      const candidatePath = [
        `${prefix}.${localization}${suffix}`,
        `${prefix}.${localization.split('-')[0]}${suffix}`,
        `${prefix}${suffix}`,
      ];
      let targetPath = '';
      for (const p of candidatePath) {
        if (assetsMap[p]) {
          targetPath = assetsMap[p];
          break;
        }
      }
      if (targetPath) {
        const url = extensionUri
          .with({
            scheme: extensionUri.scheme === EXT_SCHEME ? 'https' : extensionUri.scheme,
            path: posix.join(extensionUri.path, targetPath),
          })
          .toString();
        const res = await fetch(url);
        if (res.status >= 200 && res.status < 300) {
          extensionExtraMetaData[extraField] = await res.text();
          continue;
        }
      }
    } catch (e) {
      console.error(e);
    }
    extensionExtraMetaData[extraField] = null;
  }
  return extensionExtraMetaData;
}

async function getExtension(
  ext: IExtensionBasicMetadata,
  localization: string,
  extraMetaData?: ExtraMetadata,
  OSSPath?: string,
) {
  const extensionPath = ext.mode === 'local' && ext.uri ? ext.uri : getExtensionPath(ext.extension, ext.mode, OSSPath);
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
        `^${localization}|${localization.toLowerCase()}|${localization.split('-')[0]}$`,
      );
      if (reg.test(languageId)) {
        try {
          const res = await fetch(
            extensionUri.with({ scheme: 'https' }).toString() + '/' + filename,
          );
          if (res.status >= 200 && res.status < 300) {
            pkgNlsJSON = await res.json();
          }
        } catch (err) {}
        break;
      }
    }
  }

  const extraMetadata = await getExtraMetaData(
    ext.webAssets,
    extensionUri,
    localization,
    extraMetaData,
  );

  return {
    id: `${ext.packageJSON.publisher}.${ext.packageJSON.name}`,
    extensionId: `${ext.extension.publisher}.${ext.extension.name}`,
    packageJSON: ext.packageJSON,
    defaultPkgNlsJSON: ext.defaultPkgNlsJSON,
    packageNlsJSON: pkgNlsJSON,
    extraMetadata,
    path: extensionPath,
    realPath: extensionPath,
    extendConfig: ext.extendConfig,
    isBuiltin: true,
    isDevelopment: ext.mode === 'local',
    uri: extensionUri,
  };
}
