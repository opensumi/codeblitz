import ApiConstants from './constants/ApiConstants';
import { apiService } from './api.service';
import { Project } from './types/project';
import { User } from './types/user';
import { FileAction, FileActionHeader, FileActionResult } from './types/file-action';

export const projectService = {
  async getUser(): Promise<User> {
    return apiService.get(`${ApiConstants.prefix}/user`);
  },

  async getProject(namespace: string, projectName: string) {
    return (await apiService.get(`/webapi/projects/${namespace}%2F${projectName}/`)) as Project;
  },

  async getFileBlob(
    projectId: number,
    sha: string,
    filepath: string,
    options: {
      maxSize?: number;
      charsetName?: string;
    } = {}
  ) {
    return (await apiService.get(
      `${ApiConstants.prefix}/projects/${projectId}/repository/blobs/${encodeURIComponent(sha)}`,
      {
        filepath,
        ...options,
      }
    )) as string;
  },

  async getLanguages(
    projectId: number,
    params?: {
      size?: number;
      orderBy?: 'size' | 'count';
      aggBy?: 'file_extension' | 'language';
    }
  ) {
    return (await apiService.get(`/api/v4/projects/${projectId}/languages`, params, {
      disableResponseConvert: true,
    })) as Record<string, number>;
  },

  async bulkChangeFiles(projectId: number, actions: FileAction[], header: FileActionHeader) {
    return (await apiService.post(`/api/v4/projects/${projectId}/repository/files`, undefined, {
      actions,
      header,
    })) as FileActionResult[];
  },
};
