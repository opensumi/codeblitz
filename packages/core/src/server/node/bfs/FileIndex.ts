import { BrowserFS, FileIndex } from '@alipay/alex-core';
import { BFSCallback, FileSystemOptions } from 'browserfs/dist/node/core/file_system';
import { FileFlag } from 'browserfs/dist/node/core/file_flag';
import InMemory from 'browserfs/dist/node/backend/InMemory';

export interface FileIndexSystemOptions {
  requestFileIndex: () => Promise<FileIndex>;
}

interface WalkEvent {
  (params: { type: 'file'; path: string; content: string }): void;
  (params: { type: 'dir'; path: string; content: FileIndex }): void;
}

export const walkFileIndex = (fileIndex: FileIndex, cb: WalkEvent) => {
  const queue: [string, FileIndex][] = [['', fileIndex]];
  while (queue.length > 0) {
    const next = queue.pop();
    const pwd = next![0];
    const tree = next![1];
    for (const node in tree) {
      if (tree.hasOwnProperty(node)) {
        const children = tree[node];
        const path = `${pwd}/${node}`;
        if (typeof children === 'string') {
          cb({ type: 'file', path, content: children });
        } else {
          cb({ type: 'dir', path, content: children });
          queue.push([path, children]);
        }
      }
    }
  }
};

/**
 * 基于 memory 的文件系统，需提供全量文件索引接口: { src: { 'main.js': '...' }, 'package.json': '...' }
 */
export class FileIndexSystem extends InMemory {
  public static readonly Name = 'FileIndex';

  public static readonly Options: FileSystemOptions = {
    requestFileIndex: {
      type: 'function',
      description: 'API for get file index',
    },
  };

  /**
   * Creates an InMemoryFileSystem instance.
   */
  public static Create(options: FileIndexSystemOptions, cb: BFSCallback<FileIndexSystem>): void {
    super.Create({}, (err, memfs) => {
      if (err || !memfs) {
        return cb(err);
      }
      options.requestFileIndex().then((fileIndex) => {
        if (!fileIndex) {
          throw new Error('requestFileIndex should return a object bu got nil');
        }
        const mode = 0x1ff; // 0x777
        const encoding = 'utf8';
        const flag = FileFlag.getFileFlag('w');
        if (!memfs.existsSync('/')) {
          memfs.mkdirSync('/', mode);
        }
        walkFileIndex(fileIndex, ({ type, path, content }) => {
          if (type === 'file') {
            memfs.writeFileSync(path, content, encoding, flag, mode);
          } else if (type === 'dir') {
            memfs.mkdirSync(path, mode);
          }
        });
      });

      cb(null, memfs);
    });
  }
}
