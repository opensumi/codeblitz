import { Injectable } from '@opensumi/di';
import { Uri, Event } from '@opensumi/ide-core-browser';
import {
  FileSystemProvider,
  FileStat,
  FileType,
  FileChangeEvent,
  FileSystemProviderCapabilities,
} from '@opensumi/ide-file-service';
import { BinaryBuffer } from '@opensumi/ide-core-common/lib/utils/buffer';

/**
 * 解析 kt-ext:// 文件，解决前端插件加载问题
 */
@Injectable()
export class KaitianExtFsProvider implements FileSystemProvider {
  readonly capabilities: FileSystemProviderCapabilities;
  onDidChangeCapabilities = Event.None;
  async readFile(uri: Uri) {
    const requestUrl = uri.with({ scheme: 'https' });

    return await fetch(requestUrl.toString(), {
      headers: {
        'Accept-Encoding': 'gzip, deflate',
      },
    })
      .then((res) => res.text())
      .then((content) => BinaryBuffer.fromString(content).buffer);
  }

  // fake implements
  onDidChangeFile: Event<FileChangeEvent>;
  watch(uri: Uri, options: { recursive: boolean; excludes: string[] }): number {
    throw new Error('Method not implemented.');
  }

  stat(uri: Uri): Promise<FileStat | void> {
    throw new Error('Method not implemented.');
  }

  readDirectory(uri: Uri): [string, FileType][] | Promise<[string, FileType][]> {
    throw new Error('Method not implemented.');
  }

  createDirectory(uri: Uri): void | Promise<void | FileStat> {
    throw new Error('Method not implemented.');
  }

  writeFile(
    uri: Uri,
    content: Buffer,
    options: { create: boolean; overwrite: boolean }
  ): void | Thenable<void | FileStat> {
    throw new Error('Method not implemented.');
  }

  delete(
    uri: Uri,
    options: { recursive: boolean; moveToTrash?: boolean | undefined }
  ): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  rename(
    oldstring: Uri,
    newstring: Uri,
    options: { overwrite: boolean }
  ): void | Promise<void | FileStat> {
    throw new Error('Method not implemented.');
  }
}
