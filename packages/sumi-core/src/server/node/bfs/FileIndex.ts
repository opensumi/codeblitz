import { InMemoryStore } from '@codeblitzjs/ide-browserfs/lib/backend/InMemory';
import { ApiError, ErrorCode } from '@codeblitzjs/ide-browserfs/lib/core/api_error';
import { FileFlag } from '@codeblitzjs/ide-browserfs/lib/core/file_flag';
import { BFSCallback, FileSystemOptions } from '@codeblitzjs/ide-browserfs/lib/core/file_system';
import { SyncKeyValueFileSystem } from '@codeblitzjs/ide-browserfs/lib/generic/key_value_filesystem';
export interface FileIndex {
  [key: string]: FileIndex | string;
}

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
export class FileIndexSystem extends SyncKeyValueFileSystem {
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
    const fs = new FileIndexSystem();
    options
      .requestFileIndex()
      .then((fileIndex) => {
        if (!fileIndex) {
          throw new Error('requestFileIndex should return a object but got nil');
        }
        const mode = 0x1ff; // 0x777
        const encoding = 'utf8';
        const flag = FileFlag.getFileFlag('w');
        if (!fs.existsSync('/')) {
          fs.mkdirSync('/', mode);
        }
        walkFileIndex(fileIndex, ({ type, path, content }) => {
          if (type === 'file') {
            fs.writeFileSync(path, content, encoding, flag, mode);
          } else if (type === 'dir') {
            fs.mkdirSync(path, mode);
          }
        });
        cb(null, fs);
      })
      .catch(() => {
        cb(new ApiError(ErrorCode.EINVAL, 'failed to requestFileIndex'));
      });
  }

  private constructor() {
    super({ store: new InMemoryStore() });
  }
}
