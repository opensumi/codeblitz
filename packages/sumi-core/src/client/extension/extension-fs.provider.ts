import { Injectable } from '@opensumi/di';
import { Event, Uri } from '@opensumi/ide-core-browser';
import {
  FileChangeEvent,
  FileStat,
  FileSystemProvider,
  FileSystemProviderCapabilities,
  FileType,
} from '@opensumi/ide-file-service';

/**
 * @class 解析 kt-ext:// 文件，解决前端插件加载问题
 */
@Injectable()
export class OpenSumiExtFsProvider implements FileSystemProvider {
  private readonly now = Date.now();
  readonly capabilities: FileSystemProviderCapabilities;
  onDidChangeCapabilities = Event.None;

  onDidChangeFile: Event<FileChangeEvent>;

  watch(): number {
    throw new Error('Method not implemented.');
  }

  stat(uri: Uri): Promise<FileStat | void> {
    return Promise.resolve({
      uri: uri.toString(),
      lastModification: this.now,
    } as FileStat);
  }

  readDirectory(): [string, FileType][] | Promise<[string, FileType][]> {
    throw new Error('Method not implemented.');
  }

  createDirectory(): void | Promise<void | FileStat> {
    throw new Error('Method not implemented.');
  }

  async readFile(uri: Uri): Promise<Uint8Array> {
    const requestUrl = uri.with({ scheme: location.protocol.slice(0, -1) });

    const res = await fetch(requestUrl.toString(), {
      headers: {
        'Accept-Encoding': 'gzip, deflate',
      },
    });
    return new Uint8Array(await res.arrayBuffer());
  }

  writeFile(): void | Thenable<void | FileStat> {
    throw new Error('Method not implemented.');
  }

  delete(): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  rename(): void | Promise<void | FileStat> {
    throw new Error('Method not implemented.');
  }
}
