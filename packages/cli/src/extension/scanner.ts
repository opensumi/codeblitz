/**
 * copy from @ali/ide-kaitian-extension/src/node/extension.scanner.ts
 */

import * as path from 'path';
import * as fs from 'fs-extra';

import { IWorkExtensionMetaData, ExtraMetaData } from './type';
import { mergeContributes } from './merge-contributes';

export class ExtensionScanner {

  private results: Map<string, IWorkExtensionMetaData> = new Map();

  constructor(
    private scan: string[],
    private extraMetaData: ExtraMetaData,
  ) { }

  public async run(): Promise<IWorkExtensionMetaData[]> {
    await Promise.all(this.scan.map((dir) => this.scanDir(dir)));
    return Array.from(this.results.values());
  }

  private async scanDir(dir: string): Promise<void> {
    try {
      const extensionDirArr = await fs.readdir(dir);
      await Promise.all(extensionDirArr.map((extensionDir) => {
        const extensionPath = path.join(dir, extensionDir);
        return this.getExtension(extensionPath);
      }));
    } catch (e) {
      console.error(e);
    }
  }

  static async getLocalizedExtraMetadataPath(prefix: string, extensionPath: string, localization: string, suffix: string): Promise<string | undefined> {
    const lowerCasePrefix = prefix.toLowerCase();
    const lowerCaseLocalization = localization.toLowerCase();
    const maybeExist = [
      `${prefix}.${localization}${suffix}`, // {prefix}.zh-CN{suffix}
      `${lowerCasePrefix}.${localization}${suffix}`,
      `${prefix}.${lowerCaseLocalization}${suffix}`, // {prefix}.zh-cn{suffix}
      `${lowerCasePrefix}.${lowerCaseLocalization}${suffix}`,
      `${prefix}.${localization.split('-')[0]}${suffix}`,       // {prefix}.zh{suffix}
      `${lowerCasePrefix}.${localization.split('-')[0]}${suffix}`,
    ];

    for (const maybe of maybeExist) {
      const filepath = path.join(extensionPath, maybe);
      if (await fs.pathExists(filepath)) {
        return filepath;
      }
    }
    return undefined;
  }

  /**
   * 获取所有的 localized 文件数据
   */
  static async getAllLocalizedExtraMetadata(extensionPath: string, prefix: string, suffix: string): Promise<Record<string, any>> {
    const fileList = await fs.readdir(extensionPath)
    const result = {}
    for (const file of fileList) {
      const filePath = path.join(extensionPath, file)
      const fileStat = await fs.stat(filePath)
      if (fileStat.isFile()) {
        const matched = filePath.match(new RegExp(`${prefix}(.+)${suffix}`))
        if (matched) {
          const locale = matched[1]
          result[locale] = await fs.readJSON(filePath)
        }
      }
    }
    return result
  }

  static async getExtension(extensionPath: string, extraMetaData?: ExtraMetaData): Promise<IWorkExtensionMetaData | undefined> {
    try {
      await fs.stat(extensionPath);
    } catch (e) {
      console.error(`extension path ${extensionPath} does not exist`);
      return;
    }

    const pkgPath = path.join(extensionPath, 'package.json');
    const defaultPkgNlsPath = path.join(extensionPath, 'package.nls.json');
    const extendPath = path.join(extensionPath, 'kaitian.js');
    const pkgExist = await fs.pathExists(pkgPath);
    const defaultPkgNlsPathExist = await fs.pathExists(defaultPkgNlsPath);
    const extendExist = await fs.pathExists(extendPath);
    const allPkgNlsJSON = await ExtensionScanner.getAllLocalizedExtraMetadata(extensionPath, 'package.nls', '.json')

    let pkgCheckResult = pkgExist;
    const extendCheckResult = extendExist;

    if (pkgExist) {
      try {
        const packageJSON = await fs.readJSON(pkgPath);
        if (!packageJSON.engines) {
          pkgCheckResult = false;
        } else if (!(packageJSON.engines.vscode || packageJSON.engines.kaitian)) {
          pkgCheckResult = false;
        }
      } catch (e) {
        console.error(e);
        pkgCheckResult = false;
      }
    }

    let defaultPkgNlsJSON: { [key: string]: string } | undefined;
    if (defaultPkgNlsPathExist) {
      defaultPkgNlsJSON = await fs.readJSON(defaultPkgNlsPath);
    }

    if (!(pkgCheckResult || extendCheckResult)) {
      return;
    }

    const extensionExtraMetaData = {};
    let packageJSON = {} as any;
    try {
      packageJSON = await fs.readJSON(pkgPath);
      if (extraMetaData) {
        for (const extraField of Object.keys(extraMetaData)) {
          try {
            extensionExtraMetaData[extraField] = await fs.readFile(path.join(extensionPath, extraMetaData[extraField]), 'utf-8');
          } catch (e) {
            extensionExtraMetaData[extraField] = null;
          }
        }
      }
    } catch (e) {
      console.error(e);
      return;
    }

    let extendConfig = {};
    if (await fs.pathExists(extendPath)) {
      try {
        // 这里必须clear cache, 不然每次都一样
        delete require.cache[extendPath];
        extendConfig = require(extendPath);
      } catch (e) {
        console.error(e);
      }
    }

    // merge for `kaitianContributes` and `contributes`
    packageJSON.contributes = mergeContributes(
      packageJSON.kaitianContributes,
      packageJSON.contributes,
    );

    const extension: IWorkExtensionMetaData = {
      id: `${packageJSON.publisher}.${packageJSON.name}`,
      extensionId: this.getExtensionIdByExtensionPath(extensionPath, packageJSON.version),
      packageJSON,
      defaultPkgNlsJSON,
      allPkgNlsJSON,
      extraMetadata: extensionExtraMetaData,
      extendConfig,
    };
    return extension
  }

  /**
   * 通过文件夹名获取插件 id
   * 文件夹名目前有两种：
   *  1. ${publisher}.${name}-${version} (推荐)
   *  2. ${extensionId}-${name}-${version}
   *  以上两种
   * @param folderName
   * @param version 可能有用户使用非 semver 的规范，所以传进来
   */
  static getExtensionIdByExtensionPath(extensionPath: string, version?: string) {
    const regExp = version ? new RegExp(`^(.+?)\\.(.+?)-(${version})$`) : /^(.+?)\.(.+?)-(\d+\.\d+\.\d+)$/;
    const dirName = path.basename(extensionPath);
    const match = regExp.exec(dirName);

    if (match == null) {
      // 按照第二种方式返回
      return dirName.split('-')[0];
    }

    const [, publisher, name] = match;
    return `${publisher}.${name}`;
  }

  public async getExtension(extensionPath: string, extraMetaData?: ExtraMetaData): Promise<IWorkExtensionMetaData | undefined> {

    if (this.results.has(extensionPath)) {
      return;
    }

    const extension = await ExtensionScanner.getExtension(extensionPath, {
      ...this.extraMetaData,
      ...extraMetaData,
    });

    if (extension) {
      this.results.set(extensionPath, extension);
      return extension;
    }
  }
}
