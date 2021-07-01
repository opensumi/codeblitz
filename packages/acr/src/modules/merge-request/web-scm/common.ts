import { diff_match_patch as diffMatchPatch } from 'diff-match-patch';

export const WebSCMViewId = 'web-scm';

export class WebSCMCommands {
  static Edit = {
    id: 'web-scm.edit',
  };

  static Save = {
    id: 'web-scm.save',
  };

  static DiscardChanges = {
    id: 'web-scm.discardChanges',
  };

  static Refresh = {
    id: 'web-scm.refresh',
  };

  static CommitAndPush = {
    id: 'web-scm.commitAndPush',
  };

  static OpenFile = {
    id: 'web-scm.openFile',
  };

  static DiscardAllChanges = {
    id: 'web-scm.discardAllChanges',
  };

  static DownloadDiffFile = {
    id: 'web-scm.downloadDiffFile',
  };
}

export const IDmpService = Symbol('IDmpService');
export interface IDmpService {
  dmpInstance: diffMatchPatch;
}
