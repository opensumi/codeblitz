import { apiService } from './api.service';
import { FileWithCommit, TreeEntry } from './types/file';
import { Blame } from './types/commit';

export const repoService = {
  async getFileList(projectId: number, refName: string, path: string, withCommit?: boolean) {
    return (await apiService.get(`/webapi/projects/${projectId}/repository/tree`, {
      refName,
      path,
      withCommit,
    })) as FileWithCommit[];
  },

  async getTreeEntry(projectId: number, refName: string, path: string) {
    return (await apiService.get(`/api/v3/projects/${projectId}/repository/tree_entry`, {
      refName,
      path,
    })) as TreeEntry;
  },

  async getFileDetail(projectId: number, ref: string, filepath: string, charsetName?: string) {
    return await apiService.get(
      `/api/v3/projects/${projectId}/repository/blobs/${encodeURIComponent(ref)}`,
      {
        filepath,
        charsetName,
      },
      {
        disableResponseConvert: true,
        getOriginalResponse: true,
      }
    );
  },

  async getCodeSymbols(projectId: number, ref: string, filepath: string) {
    return await apiService.get(
      `/api/v3/projects/${projectId}/repository/file_symbols/${encodeURIComponent(ref)}/`,
      {
        filepath,
      }
    );
  },

  async getCodeBlame(projectId: number, sha: string, filePath: string) {
    return (await apiService.get(`/api/v3/projects/${projectId}/repository/blame`, {
      sha,
      filePath,
    })) as Blame[];
  },
};
