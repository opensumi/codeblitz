import { BrowserFS, BrowserFSFileType, WORKSPACE_IDB_NAME } from '@codeblitzjs/ide-sumi-core';
import { CodeModelService } from '../code-model.service';
import { Repository } from '../repository';
import { TreeEntry } from '../types';

interface TreeEntryWithRepo extends TreeEntry {
  repo: Repository;
}

const configureFileSystem = async (
  model: CodeModelService,
  scenario?: string | null,
  isInMemory?: boolean
) => {
  const {
    createFileSystem,
    FileSystem: { DynamicRequest, OverlayFS, FolderAdapter, IndexedDB, InMemory },
  } = BrowserFS;

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

export default configureFileSystem;
