import retry from 'async-retry';
import awaitEvent from 'await-event';
import * as contentDisposition from 'content-disposition';
import _debug from 'debug';
import * as fs from 'fs-extra';
import flatten from 'lodash.flatten';
import * as os from 'os';
import * as path from 'path';
import { Readable } from 'stream';
import * as urllib from 'urllib';
import { v4 as uuidv4 } from 'uuid';
import * as yauzl from 'yauzl';

const debug = _debug('installer');

class ExtensionRequestError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export function safeJsonParse<T = any>(jsonStr: string): T | undefined {
  if (!jsonStr) return;
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.warn(err);
  }
}

export interface RequestHeaders {
  [header: string]: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IExtensionInstaller {
  install(extension: Extension): Promise<string | string[]>;
  installByRelease(release: ExtensionRelease): Promise<string | string[]>;
  installByOriginId(extension: OriginExtension): Promise<string | string[]>;
}

export enum ExtensionDownloadMode {
  /**
   * 直接下载方式，一次下载
   */
  DIRECT = 'direct',
  REDIRECT = 'redirect',
}

export enum ExtensionType {
  OPENSUMI = 'OpenSumi',
  JETBRAINS = 'Jetbrains',
}

/**
 * 插件下载器参数
 */
export interface ExtensionInstallerOptions {
  /**
   * 账户 ID
   */
  accountId: string;
  /**
   * 账户秘钥
   */
  masterKey: string;
  /**
   * 下载方式，默认值为重定向下载
   */
  mode?: ExtensionDownloadMode;
  /**
   * 插件下载类型，默认为 opensumi
   */
  extensionType?: ExtensionType;
  /**
   * 插件默认安装的路径
   */
  dist?: string;
  /**
   * api 地址，默认为 https://marketplace.opentrs.cn/
   */
  api?: string;
  /**
   * IDE 框架版本，默认为
   */
  frameworkVersion?: string;
  /**
   * 当前环境是否在 Electron 环境下
   */
  isElectronEnv?: boolean;
  /**
   * 下载时插件市场下载次数不加1
   */
  ignoreIncreaseCount?: boolean;
  /**
   * 跳转 OSS 的地址是否是 http 协议
   */
  isRedirectUrlWithHttpProtocol?: boolean;
  /**
   * proxy 地址
   */
  proxy?: string;
  /**
   * 安装报错时重试的次数
   */
  retry?: number;
  /**
   * 请求是的一些参数
   */
  request?: {
    /**
     * 下载时额外加的 headers 信息
     */
    headers?: RequestHeaders;
    /**
     * 请求前最后一次拦截
     */
    beforeRequest?: (...args: any[]) => void;
  };
  /**
   * 插件直接下载的时候，插件市场会返回一个 content-disposition headers
   * 如果此值设置为 true，那么下载完插件后不会以 content-disposition 的数据为基础创建插件文件夹的名称
   */
  ignoreContentDisposition?: boolean;
}

export interface Extension {
  /**
   * 团队名
   */
  publisher: string;
  /**
   * 插件名
   */
  name: string;
  /**
   * 要安装的版本号。若不填写则为当前框架的最新版本插件
   */
  version?: string;
  /**
   *  目标下载地址
   */
  dist?: string;
}

export interface ExtensionRelease {
  releaseId: string;
  /**
   *  目标下载地址
   */
  dist?: string;
}

export interface OriginExtension {
  /**
   * 插件原始 ID
   */
  originId: string;
  version?: string;
  /**
   *  目标下载地址
   */
  dist?: string;
}

export const DEFAULT_API = 'https://marketplace.opentrs.cn';

function createZipFile(zipFilePath: string): Promise<yauzl.ZipFile> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
      } else {
        resolve(zipfile);
      }
    });
  });
}

async function downloadExtension(
  url: string,
  options: ExtensionInstallerOptions,
  extensionName: string,
  extension?: Extension,
): Promise<{ tmpZipFile: string; targetDirName: string }> {
  // 防止下载同样名称的插件而报错

  const tmpPath = path.join(os.tmpdir(), 'extension', uuidv4());
  const tmpZipFile = path.join(tmpPath, `${extensionName}.zip`);
  await fs.mkdirp(tmpPath);
  const tmpStream = fs.createWriteStream(tmpZipFile);
  debug(`${url} download start`);
  const data = await urllib.request(url, {
    streaming: true,
    followRedirect: true,
    ...options.proxy && {
      enableProxy: true,
      proxy: options.proxy,
    },
    headers: {
      'x-account-id': options.accountId,
      'x-master-key': options.masterKey,
      // 默认使用重定向下载
      'x-download-mode': options.mode ? options.mode : ExtensionDownloadMode.REDIRECT,
      ...options.isRedirectUrlWithHttpProtocol && {
        'x-download-protocol': 'http',
      },
      ...options.frameworkVersion && {
        'x-framework-version': options.frameworkVersion,
      },
      ...options.ignoreIncreaseCount && {
        'x-from': 'cli',
      },
      ...options.request?.headers,
    },
    ...options.request?.beforeRequest && {
      beforeRequest: options.request?.beforeRequest,
    },
  });

  if (data.status !== 200) {
    throw new ExtensionRequestError(`request ${extensionName} error, status: ${data.status}`, data.status);
  }

  data.res.pipe(tmpStream);
  await Promise.race([awaitEvent(data.res, 'end'), awaitEvent(data.res, 'error')]);
  tmpStream.close();
  debug(`${url} download finish`);
  // 直接下载会有 content-disposition headers
  const disposition = data.headers['content-disposition'];
  // OSS 下载一定是确定的 publisher, name 和 version
  const targetDirName = Boolean(disposition) && !Boolean(options.ignoreContentDisposition)
    ? path.basename(contentDisposition.parse(disposition).parameters.filename, '.zip')
    : `${extension?.publisher}.${extension?.name}-${extension?.version}`;
  return { tmpZipFile, targetDirName };
}

function openZipStream(zipFile: yauzl.ZipFile, entry: yauzl.Entry): Promise<Readable> {
  return new Promise((resolve, reject) => {
    zipFile.openReadStream(entry, (error: Error | null, stream: Readable) => {
      if (error) {
        reject(error);
      } else {
        resolve(stream);
      }
    });
  });
}

function modeFromEntry(entry: yauzl.Entry): number {
  const attr = entry.externalFileAttributes >> 16 || 33188;

  return [448, /* S_IRWXU */ 56, /* S_IRWXG */ 7 /* S_IRWXO */]
    .map(mask => attr & mask)
    .reduce((a, b) => a + b, attr & 61440 /* S_IFMT */);
}

export class ExtensionInstaller implements IExtensionInstaller {
  constructor(private options: ExtensionInstallerOptions) {
  }

  private getURL(extension: Extension): string {
    return `${this.options.api || DEFAULT_API}/openapi/ide/download/${extension.publisher}.${extension.name}${
      extension.version ? '?version=' + extension.version : ''
    }`;
  }

  private getReleaseURL(releaseId: string): string {
    return `${this.options.api || DEFAULT_API}/openapi/ide/download/release/${releaseId}`;
  }

  private getOriginURL(extension: OriginExtension): string {
    return `${this.options.api || DEFAULT_API}/openapi/ide/download/origin/${extension.originId}${
      extension.version ? '?version=' + extension.version : ''
    }`;
  }

  private createZipFile(zipFilePath: string): Promise<yauzl.ZipFile> {
    return retry(() => createZipFile(zipFilePath), { retries: this.options.retry || 0 });
  }

  /**
   * 暂时先不处理 extensionPack 的情况
   */
  private async installExtensionsInPackFromPkg(pkgStr: string, dist: string): Promise<string[]> {
    const pkg = safeJsonParse(pkgStr);
    // const extensionPack = pkg?.extensionPack;
    const extensionPack = [];
    return extensionPack
      ? await this.installExtensions(
        extensionPack?.map((id: string) => {
          const [publisher, name] = id.split('.');
          return {
            publisher,
            name,
            dist,
          };
        }),
      )
      : [];
  }

  private async installExtensions(exts: Extension[]): Promise<string[]> {
    const result = await Promise.all(exts.map((e: Extension) => {
      return this.install(e);
    }));
    return flatten(result, Infinity);
  }

  private async checkExtensionType(tmpZipFile: string): Promise<ExtensionType> {
    return new Promise<ExtensionType>(async (resolve, reject) => {
      try {
        const zipFile = await this.createZipFile(tmpZipFile);
        zipFile.readEntry();
        zipFile.on('error', (e) => {
          reject(e);
        });

        zipFile.on('entry', (entry) => {
          if (entry.fileName === 'extension/package.json') {
            resolve(ExtensionType.OPENSUMI);
          } else {
            zipFile.readEntry();
          }
        });

        zipFile.on('close', function() {
          resolve(ExtensionType.JETBRAINS);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private async checkJarExtension(tmpZipFile: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const zipFile = await this.createZipFile(tmpZipFile);
        zipFile.readEntry();
        zipFile.on('error', (e) => {
          reject(e);
        });

        zipFile.on('entry', (entry) => {
          // 判断如果文件名是 META-INF，则说明该插件是 jar 文件，应该直接复制
          if (entry.fileName === 'META-INF/') {
            resolve(true);
          } else {
            zipFile.readEntry();
          }
        });

        zipFile.on('close', function() {
          resolve(false);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private async unzip(dist: string, targetDirName: string, tmpZipFile: string): Promise<string | string[]> {
    // 如果没传 extensionType 则去检查插件类型
    const type = this.options.extensionType || await this.checkExtensionType(tmpZipFile);
    debug(`${targetDirName} unzip start`);
    const dirs = type === ExtensionType.OPENSUMI
      ? await this.unzipOpenSumiExtension(dist, targetDirName, tmpZipFile)
      : await this.unzipJetbrainsExtension(dist, targetDirName, tmpZipFile);
    debug(`${targetDirName} unzip finish`);
    return dirs;
  }

  private async unzipOpenSumiExtension(
    dist: string,
    targetDirName: string,
    tmpZipFile: string,
  ): Promise<string | string[]> {
    // 解压插件
    const targetPath = await this.unzipFile(dist, targetDirName, tmpZipFile);

    const pkg = fs.readFileSync(path.resolve(targetPath, 'package.json'), 'utf-8');

    const childPaths = await this.installExtensionsInPackFromPkg(pkg, dist);

    return childPaths?.length > 0 ? [targetPath, ...childPaths] : targetPath;
  }

  private async unzipJetbrainsExtension(
    dist: string,
    targetDirName: string,
    tmpZipFile: string,
  ): Promise<string | string[]> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const isJarExtension = await this.checkJarExtension(tmpZipFile);
        // 如果是 jar 插件，则直接复制
        if (isJarExtension) {
          const dest = path.join(dist, path.basename(tmpZipFile, '.zip') + '.jar');
          await fs.copy(tmpZipFile, dest, { overwrite: true });
          resolve(dest);
        } else {
          let readFirst = false;
          let extensionDirName = '';
          const zipFile = await this.createZipFile(tmpZipFile);
          zipFile.readEntry();
          zipFile.on('error', (e) => {
            reject(e);
          });

          zipFile.on('close', () => {
            fs.remove(tmpZipFile).then(() => resolve(path.join(dist, extensionDirName)));
          });

          zipFile.on('entry', (entry) => {
            const targetFileName = path.join(dist, entry.fileName);
            if (/\/$/.test(entry.fileName)) {
              if (!readFirst) {
                // jetbrains 插件下只有一个文件夹，这个文件夹名就是下载插件目录的名称
                extensionDirName = entry.fileName;
                readFirst = true;
              }
              fs.mkdirp(targetFileName).then(() => zipFile.readEntry());
            } else {
              zipFile.openReadStream(entry, (err, readStream) => {
                if (err) {
                  reject(err);
                } else {
                  readStream.on('end', () => {
                    zipFile.readEntry();
                  });
                  fs.mkdirp(path.dirname(targetFileName)).then(() =>
                    readStream.pipe(fs.createWriteStream(targetFileName))
                  );
                }
              });
            }
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  private async _installByRelease(release: ExtensionRelease): Promise<string | string[]> {
    if (!release.releaseId) {
      throw new Error('releaseId is required');
    }
    const dist = release.dist || this.options.dist;
    if (!dist) {
      throw new Error('dist is required');
    }

    // 下载插件
    const { targetDirName, tmpZipFile } = await downloadExtension(
      this.getReleaseURL(release.releaseId),
      this.options,
      release.releaseId,
    );
    return this.unzip(dist, targetDirName, tmpZipFile);
  }

  private async _installByOriginId(extension: OriginExtension): Promise<string | string[]> {
    if (!extension.originId) {
      throw new Error('releaseId is required');
    }
    const dist = extension.dist || this.options.dist;
    if (!dist) {
      throw new Error('dist is required');
    }
    // 下载插件
    const { targetDirName, tmpZipFile } = await downloadExtension(
      this.getOriginURL(extension),
      this.options,
      extension.originId,
    );
    return this.unzip(dist, targetDirName, tmpZipFile);
  }

  private async _install(extension: Extension): Promise<string | string[]> {
    const dist = extension.dist || this.options.dist;
    if (!dist) {
      throw new Error('dist is required');
    }

    // 下载插件
    const { targetDirName, tmpZipFile } = await downloadExtension(
      this.getURL(extension),
      this.options,
      extension.name,
      extension,
    );
    return this.unzip(dist, targetDirName, tmpZipFile);
  }

  private retry(fn: () => Promise<string | string[]>): Promise<string | string[]> {
    return retry(async (bail) => {
      try {
        return await fn();
      } catch (e) {
        debug('extension install error', e);
        // 不对插件 403, 404 的错误进行重试
        if ([403, 404].includes((e as any).status)) {
          bail(e);
          return;
        } else {
          throw e;
        }
      }
    }, {
      retries: this.options.retry || 0,
    });
  }

  public install(extension: Extension): Promise<string | string[]> {
    return this.retry(() => this._install(extension));
  }

  public installByRelease(release: ExtensionRelease): Promise<string | string[]> {
    return this.retry(() => this._installByRelease(release));
  }

  public installByOriginId(extension: OriginExtension): Promise<string | string[]> {
    return this.retry(() => this._installByOriginId(extension));
  }

  private unzipFile(dist: string, targetDirName: string, tmpZipFile: string): Promise<string> {
    const sourcePathRegex = new RegExp('^extension');
    return new Promise<string>(async (resolve, reject) => {
      try {
        const extensionDir = path.join(dist, targetDirName);
        // 创建插件目录
        await fs.mkdirp(extensionDir);

        const zipFile = await createZipFile(tmpZipFile);
        zipFile.readEntry();
        zipFile.on('error', (e) => {
          reject(e);
        });

        zipFile.on('close', () => {
          if (!fs.pathExistsSync(path.join(extensionDir, 'package.json'))) {
            reject(`Download Error: ${extensionDir}/package.json`);
            return;
          }
          fs.remove(tmpZipFile).then(() => resolve(extensionDir));
        });

        zipFile.on('entry', (entry) => {
          if (!sourcePathRegex.test(entry.fileName)) {
            zipFile.readEntry();
            return;
          }
          let fileName = entry.fileName.replace(sourcePathRegex, '');

          if (/\/$/.test(fileName)) {
            const targetFileName = path.join(extensionDir, fileName);
            fs.mkdirp(targetFileName).then(() => zipFile.readEntry());
            return;
          }

          let originalFileName;
          // 在Electron中，如果解包的文件中存在.asar文件，会由于Electron本身的bug导致无法对.asar创建writeStream
          // 此处先把.asar文件写到另外一个目标文件中，完成后再进行重命名
          if (fileName.endsWith('.asar') && this.options.isElectronEnv) {
            originalFileName = fileName;
            fileName += '_prevent_bug';
          }
          const readStream = openZipStream(zipFile, entry);
          const mode = modeFromEntry(entry);
          readStream.then((stream) => {
            const dirname = path.dirname(fileName);
            const targetDirName = path.join(extensionDir, dirname);
            if (targetDirName.indexOf(extensionDir) !== 0) {
              throw new Error(`invalid file path ${targetDirName}`);
            }
            const targetFileName = path.join(extensionDir, fileName);

            fs.mkdirp(targetDirName)
              .then(() => {
                const writerStream = fs.createWriteStream(targetFileName, { mode });
                writerStream.on('close', () => {
                  if (originalFileName) {
                    // rename .asar, if filename has been modified
                    fs.renameSync(targetFileName, path.join(extensionDir, originalFileName));
                  }
                  zipFile.readEntry();
                });
                stream.on('error', (err) => {
                  throw err;
                });
                stream.pipe(writerStream);
              });
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
