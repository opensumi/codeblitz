import { BrowserFS, BrowserFSFileType, WORKSPACE_IDB_NAME } from '@codeblitzjs/ide-sumi-core';
import { CodeModelService } from '../code-model.service';
import { Repository } from '../repository';
import { TreeEntry } from '../types';

interface TreeEntryWithRepo extends TreeEntry {
  repo: Repository;
}
interface TreeNode extends TreeEntry {
  children: TreeNode[];
}

const configureFileSystem = async (
  model: CodeModelService,
  scenario?: string | null,
  isInMemory?: boolean,
  recursive?: boolean,
) => {
  const {
    createFileSystem,
    FileSystem: { DynamicRequest, OverlayFS, FolderAdapter, IndexedDB, InMemory },
  } = BrowserFS;

  let treeCache: TreeNode[] = [];

  const [codeFileSystem, idbFileSystem] = await Promise.all([
    createFileSystem(DynamicRequest, {
      async readDirectory(path: string, data?: TreeEntryWithRepo) {
        let repo: Repository = data ? data.repo : model.rootRepository;
        if (data?.type === 'commit') {
          await repo.initSubmodules();
          const subRepo = model.createRepository(repo, data);
          if (!subRepo) {
            return [];
          }
          data.repo = subRepo;
          data.path = '';
          data.name = '';
          repo = subRepo;
        }

        // 全局文件系统 只调用一次 接口需要递归获取所有文件
        if (recursive) {
          if (!treeCache.length) {
            const entryList = await repo.request.getTree(data?.path || '');
            treeCache = buildTree(entryList);
          }
          if (path === '/') {
            return treeCache.map((item) => {
              return [
                item.name,
                item.type === 'blob' ? BrowserFSFileType.FILE : BrowserFSFileType.DIRECTORY,
                {
                  ...item,
                  repo,
                },
              ];
            });
          } else {
            const currentPath = path.startsWith('/') ? path.slice(1) : path;

            // 递归查找路径
            function recursiveFind(path: string, treeNode: TreeNode[], pathLen: number) {
              const p = path.split('/')[pathLen];
              const currentTree = treeNode.find((item) => item.name === p);

              if (currentTree) {
                pathLen++;
                if (pathLen === path.split('/').length) {
                  return currentTree;
                }
                return recursiveFind(path, currentTree.children, pathLen);
              } else {
                return [] as unknown as TreeNode;
              }
            }
            const result = recursiveFind(currentPath, treeCache, 0);

            return (
              result?.children.map((item) => {
                return [
                  item.name,
                  item.type === 'blob' ? BrowserFSFileType.FILE : BrowserFSFileType.DIRECTORY,
                  {
                    ...item,
                    repo,
                  },
                ];
              }) || []
            );
          }
        }
        const entryList = await repo.request.getTree(data?.path || '');

        return entryList.map((entry) => {
          if (entry.type === 'commit') {
            repo.addSubmodulePath(entry.path);
          }
          return [
            entry.name,
            entry.type === 'blob' ? BrowserFSFileType.FILE : BrowserFSFileType.DIRECTORY,
            {
              ...entry,
              repo,
            },
          ];
        });
      },
      readFile(path: string, data: TreeEntryWithRepo) {
        const { repo } = data;
        if (!repo) {
          throw new Error('Not found');
        }
        return model.codeAPI.asPlatform(repo.platform).getBlob(repo, {
          id: data.id,
          path: data.path,
          sha: data.sha,
        });
      },
      stat(path: string, data: TreeEntryWithRepo) {
        return Promise.resolve({
          size: data.size || -1,
        });
      },
    }),
    createFileSystem(isInMemory ? InMemory : IndexedDB, {
      storeName: `${WORKSPACE_IDB_NAME}${scenario ? `/${scenario}` : ''}`,
    }),
  ]);
  const folderSystem = await createFileSystem(FolderAdapter, {
    wrapped: idbFileSystem,
    folder: `/${model.getWritableFolder()}`,
  });
  const overlayFileSystem = await createFileSystem(OverlayFS, {
    readable: codeFileSystem,
    writable: folderSystem,
  });
  return {
    codeFileSystem,
    idbFileSystem,
    folderSystem,
    overlayFileSystem,
  };
};

function buildTree(data: TreeEntry[]): TreeNode[] {
  const map: Record<string, TreeNode> = {};
  const result: TreeNode[] = [];

  data.forEach((node) => {
    map[node.path] = { ...node, children: [] };
  });

  data.forEach((node) => {
    const parent = map[node.path.substring(0, node.path.lastIndexOf('/'))];
    if (parent) {
      parent.children?.push(map[node.path]);
    } else {
      result.push(map[node.path]);
    }
  });

  return result;
}

export default configureFileSystem;
