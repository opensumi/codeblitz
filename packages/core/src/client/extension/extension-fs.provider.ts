import { Injectable } from '@ali/common-di';
import { Uri, Event } from '@ali/ide-core-browser';
import { FileSystemProvider, FileStat, FileType, FileChangeEvent } from '@ali/ide-file-service';

/**
 * @class 解析 kt-ext:// 文件，解决前端插件加载问题
 */
@Injectable()
export class KaitianExtFsProvider implements FileSystemProvider {
  onDidChangeFile: Event<FileChangeEvent>;

  watch(): number {
    throw new Error('Method not implemented.');
  }

  stat(): Thenable<FileStat> {
    throw new Error('Method not implemented.');
  }

  readDirectory(): [string, FileType][] | Thenable<[string, FileType][]> {
    throw new Error('Method not implemented.');
  }

  createDirectory(): void | Thenable<void | FileStat> {
    throw new Error('Method not implemented.');
  }

  async readFile(uri: Uri): Promise<string> {
    const requestUrl = uri.with({ scheme: 'https' });

    return await fetch(requestUrl.toString(), {
      headers: {
        'Accept-Encoding': 'gzip, deflate',
      },
    }).then((res) => res.text());
  }

  writeFile(): void | Thenable<void | FileStat> {
    throw new Error('Method not implemented.');
  }

  delete(): void | Thenable<void> {
    throw new Error('Method not implemented.');
  }

  rename(): void | Thenable<void | FileStat> {
    throw new Error('Method not implemented.');
  }
}
