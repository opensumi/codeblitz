import ApiConstants from './constants/ApiConstants';
import { apiService } from './api.service';
import { PR, DiffVersion } from './types/pr';
import { Page } from './types/page';
import { Diff, DiffOverview } from './types/diff';
import { CommentPack } from './types/comment-pack';
import { Note, NoteCreatePick } from './types/note';
import { Review } from './types/review';
import { FileReadMark } from './types/file-read-mark';
import { calcChangeLineNum } from './utils/calc-change-line-num';

export const prService = {
  async getPRByIid(projectId: number, iid: string) {
    return (await apiService.get(`/webapi/projects/${projectId}/get_pull_request_by_iid`, {
      iid,
    })) as PR;
  },

  async getDiffVersions(projectId: number, prId: number) {
    return (await apiService.get(
      `/api/v3/projects/${projectId}/pull_requests/${prId}/diffs`
    )) as Page<DiffVersion>;
  },

  async getDiffs(
    projectId: number,
    from: string,
    to: string,
    options: {
      ignoreWhiteSpaceChange?: boolean;
      charsetName?: string;
    } = {}
  ) {
    const res = (await apiService.get(`/webapi/projects/${projectId}/repository/diffs`, {
      from,
      to,
      ...options,
    })) as {
      diffs: Diff[];
      overflow: boolean;
    };
    const changeLineNum = calcChangeLineNum(res.diffs);
    return {
      ...res,
      ...changeLineNum,
    };
  },

  async getDiffOverviews(projectId: number, prId: number, versionId: number) {
    return (await apiService.get(
      `/webapi/projects/${projectId}/pull_requests/${prId}/diffs/${versionId}/changes_overview`
    )) as DiffOverview[];
  },

  async getCommentPack(projectId: number, prId: number, lastFetchedAt?: number) {
    return (await apiService.get(`/webapi/projects/${projectId}/pull_requests/${prId}/comments`, {
      lastFetchedAt,
    })) as CommentPack;
  },

  async editPRComment(
    projectId: number,
    prId: number,
    noteId: number,
    payload: { state?: string; note?: string; labels?: string[] }
  ) {
    return (await apiService.put(
      `${ApiConstants.prefix}/projects/${projectId}/pull_requests/${prId}/comments/${noteId}`,
      undefined,
      payload
    )) as Note & {
      discussions?: Note[];
    };
  },

  async getDiffById(
    projectId: number,
    prId: number,
    versionId: number,
    diffId: number,
    options: {
      charsetName?: string;
    } = {}
  ) {
    return (await apiService.get(
      `/webapi/projects/${projectId}/pull_requests/${prId}/diffs/${versionId}/changes/${diffId}`,
      options
    )) as Diff;
  },

  async getFileReadMarks(projectId: number, prId: number) {
    return (await apiService.get(
      `/api/v3/projects/${projectId}/pull_requests/${prId}/diffs/mark_files`
    )) as FileReadMark[];
  },
  async markFileAsRead(projectId: number, prId: number, filePathSha: string) {
    return (await apiService.put(
      `/webapi/projects/${projectId}/pull_requests/${prId}/diffs/mark_file_as_read`,
      {
        filePathSha,
      }
    )) as {
      markAsRead: boolean;
      updatedAfterRead: boolean;
    };
  },
  async markFileAsUnread(projectId: number, prId: number, filePathSha: string) {
    return (await apiService.put(
      `/webapi/projects/${projectId}/pull_requests/${prId}/diffs/mark_file_as_unread`,
      {
        filePathSha,
      }
    )) as {
      markAsRead: boolean;
      updatedAfterRead: boolean;
    };
  },

  async addComment(projectId: number, prId: number, data: NoteCreatePick) {
    return (await apiService.post(
      `/webapi/projects/${projectId}/pull_requests/${prId}/comments`,
      undefined,
      data
    )) as Note;
  },

  async createReview(projectId: number, prId: number) {
    return (await apiService.post(
      `/api/v3/projects/${projectId}/pull_requests/${prId}/reviews`
    )) as Review;
  },

  async commitReview(projectId: number, prId: number, body: string) {
    return await apiService.put(
      `/api/v3/projects/${projectId}/pull_requests/${prId}/reviews`,
      undefined,
      {
        body,
      }
    );
  },
};
