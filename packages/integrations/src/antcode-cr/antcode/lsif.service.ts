import { apiService } from './api.service';
import { LSIFPosition } from './types/lsif';

export const lsifService = {
  async lsifExists(projectPath: string, sha: string) {
    return !!(await apiService.post(
      `/webapi/projects/${encodeURIComponent(projectPath)}/repository/lsif/exists`,
      {
        sha,
      }
    )) as boolean;
  },

  async lsifHover(
    projectId: number,
    data: {
      commit: string;
      path: string;
      position: LSIFPosition;
    }
  ) {
    return (await apiService.post(
      `/webapi/projects/${projectId}/repository/lsif/hover`,
      undefined,
      {
        ...data,
        method: 'hover',
      }
    )) as {
      contents: {
        kind: string;
        value: string;
      };
      range: {
        start: LSIFPosition;
        end: LSIFPosition;
      };
    };
  },

  async lsifDefinitions(
    projectId: number,
    data: {
      commit: string;
      path: string;
      position: LSIFPosition;
    }
  ) {
    return (await apiService.post(
      `/webapi/projects/${projectId}/repository/lsif/definitions`,
      undefined,
      data
    )) as {
      uri: string;
      range: {
        start: LSIFPosition;
        end: LSIFPosition;
      };
    };
  },

  async lsifReferences(
    projectId: number,
    data: {
      commit: string;
      path: string;
      position: LSIFPosition;
      pageNum: number;
      pageSize: number;
    }
  ) {
    return (await apiService.post(
      `/webapi/projects/${projectId}/repository/lsif/references`,
      undefined,
      data,
      {
        disableBodyConvert: true,
      }
    )) as {
      fileCount: number;
      refCount: number;
      refList: {
        uri: string;
        referenceChunks: {
          content: string;
          position: LSIFPosition;
        }[];
      }[];
    };
  },

  async lsifReferencesV2(
    projectId: number,
    data: {
      commit: string;
      path: string;
      position: LSIFPosition;
      pageNum: number;
      pageSize: number;
    }
  ) {
    return (await apiService.post(
      `/webapi/projects/${projectId}/repository/lsif/reference/v2`,
      undefined,
      data,
      {
        disableBodyConvert: true,
      }
    )) as {
      range: {
        start: LSIFPosition;
        end: LSIFPosition;
      };
      uri: string;
    }[];
  },
};
