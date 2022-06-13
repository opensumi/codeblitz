import React, {
  useState,
  useMemo,
  useRef,
  useContext,
  useEffect,
  useCallback,
  createContext,
  createElement,
  FC,
} from 'react';
import sha1 from 'sha1';
import memoize from 'lodash/memoize';
import jCookie from 'js-cookie';
import { getLocale } from '@alipay/alex-acr/lib/utils/locale';

import { useRequest } from './hooks';
import { group, repo, prIid } from './meta';
import { prService } from './antcode/pr.service';
import { projectService } from './antcode/project.service';
import { DiffVersion } from './antcode/types/pr';
import { CharsetName } from './antcode/types/charset-name';
import { Diff, DiffOverview } from './antcode/types/diff';
import { Note, NoteType, NoteState, NoteCreatePick } from './antcode/types/note';
import { Review } from './antcode/types/review';
import { Project } from './antcode/types/project';
import { PR } from './antcode/types/pr';
import { FileReadMark } from './antcode/types/file-read-mark';
import { Annotation } from './antcode/types/annotation';
import { CheckSuite } from './antcode/types/check-suite';
import { mapGetSet } from './antcode/utils/map-get-set';
import { isApiError } from './antcode/utils/api-error';

interface AnnotationPack {
  annotation: Annotation;
  checkSuite: CheckSuite;
}

function createContainer<Value>(useHook: () => Value, checkNull = false) {
  let Context = createContext<Value | null>(null);
  const Provider: FC = ({ children }) => {
    const value = useHook();
    if (checkNull && !value) return null;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  const useContainer: () => Value = () => React.useContext(Context)!;
  return [Provider, useContainer] as const;
}

const [GlobalProvider, useGlobal] = createContainer(() => {
  const data = useRequest(async () => {
    const user = await projectService.getUser();
    const project = await projectService.getProject(group, repo);
    const pr = await prService.getPRByIid(project.id, prIid);
    return {
      user,
      project,
      pr,
    };
  });
  return data;
}, true);

const [SettingProvider, useSetting] = createContainer(() => {
  const { project } = useGlobal();
  const [gbk, setGBK] = useState(() => project.encoding === 'GBK');
  const charsetName: CharsetName = gbk ? CharsetName.gbk : CharsetName.utf8;
  const [locale] = useState<string>(() => getLocale());
  const setLocale = React.useCallback(() => {
    jCookie.set('LOCALE', locale === 'en-US' ? 'zh_CN' : 'en_US');
    window.location.reload();
  }, [locale]);

  return {
    gbk,
    setGBK,
    charsetName,
    locale,
    setLocale,
  };
});

const useCommentPack = (projectId: number, prId: number) => {
  const lineToNoteIdSet = useMemo(() => new Map<string, Set<number>>(), []);
  const noteIdToNote = useMemo(() => new Map<number, Note>(), []);
  const noteIdToReviewId = useMemo(() => new Map<number, number | null>(), []);
  const reviewIdToReview = useMemo(() => new Map<number, Review>(), []);
  const noteIdToReplyIdSet = useMemo(() => new Map<number, Set<number>>(), []);
  const pendingNoteIdSet = useMemo(() => new Set<number>(), []);
  const recordNoteIdSet = useMemo(() => new Set<number>(), []);
  const topLevelCommentNoteIdSet = useMemo(() => new Set<number>(), []);
  const commentNoteIdSet = useMemo(() => new Set<number>(), []);
  const openedProblemNoteIdSet = useMemo(() => new Set<number>(), []);
  const [updateFlag, setUpdateFlag] = useState({});

  const fetchingRef = useRef(false);
  const lastFetchAtRef = useRef<number>();

  const pendingReviewRef = useRef<Review>();
  const [hasPendingReview, setHasPendingReview] = useState(false); // TODO: 去掉这个state

  function processNote(note: Note, review: Review | null = null) {
    noteIdToNote.set(note.id, note);
    noteIdToReviewId.set(note.id, review?.id!);
    if (note.type === NoteType.problem && note.state === NoteState.opened) {
      openedProblemNoteIdSet.add(note.id);
    } else {
      openedProblemNoteIdSet.delete(note.id);
    }
    if (!note.discussionId) {
      if (!note.lineCode && note.system) {
        recordNoteIdSet.add(note.id);
      } else {
        topLevelCommentNoteIdSet.add(note.id);
      }
    }
    if (note.discussionId || note.lineCode) {
      commentNoteIdSet.add(note.id);
    }
    if (note.lineCode) {
      const noteIdSet = mapGetSet(lineToNoteIdSet, note.lineCode, () => new Set<number>());
      noteIdSet.add(note.id);
    }
    if (note.discussionId) {
      const replyIdSet = mapGetSet(noteIdToReplyIdSet, note.discussionId, () => new Set<number>());
      replyIdSet.add(note.id);
    }
    if (review?.pending) {
      pendingNoteIdSet.add(note.id);
    } else {
      pendingNoteIdSet.delete(note.id);
    }
  }

  async function doRefresh(force: boolean = false) {
    if (fetchingRef.current) {
      return;
    }
    fetchingRef.current = true;
    const pack = await prService.getCommentPack(
      projectId,
      prId,
      force ? undefined : lastFetchAtRef.current
    );
    lastFetchAtRef.current = pack.currentFetchedAt;
    let updated = false;
    if (force) {
      lineToNoteIdSet.clear();
      noteIdToNote.clear();
      noteIdToReviewId.clear();
      reviewIdToReview.clear();
      noteIdToReplyIdSet.clear();
      pendingNoteIdSet.clear();
      recordNoteIdSet.clear();
      topLevelCommentNoteIdSet.clear();
      commentNoteIdSet.clear();
      openedProblemNoteIdSet.clear();
      updated = true;
    }

    for (const note of pack.notes) {
      processNote(note);
      updated = true;
    }
    for (const review of pack.committedReviews) {
      reviewIdToReview.set(review.id, review);
      for (const note of review.reviewNotes) {
        processNote(note, review);
      }
      updated = true;
    }
    if (pack.pendingReview) {
      reviewIdToReview.set(pack.pendingReview.id, pack.pendingReview);
      pendingReviewRef.current = pack.pendingReview;
      setHasPendingReview(true);
      for (const note of pack.pendingReview.reviewNotes) {
        processNote(note, pack.pendingReview);
        updated = true;
      }
    } else {
      setHasPendingReview(false);
    }
    if (updated) {
      setUpdateFlag({});
    }
    fetchingRef.current = false;
  }

  function manualUpdateReview(review: Review) {
    reviewIdToReview.set(review.id, review);
    if (review.pending) {
      pendingReviewRef.current = review;
      setHasPendingReview(!!review);
    }
    setUpdateFlag({});
  }

  function manualAddNote(note: Note, review: Review | null = null) {
    processNote(note, review);
    setUpdateFlag({});
  }

  function manualUpdateNote(note: Note) {
    const reviewId = noteIdToReviewId.get(note.id);
    const review = reviewId ? reviewIdToReview.get(reviewId) : null;
    processNote(note, review);
    setUpdateFlag({});
  }

  function getRelatedFilePathByNoteId(noteId: number) {
    const note = noteIdToNote.get(noteId);
    if (!note) return;
    let path = note.path;
    if (note.discussionId) {
      const parent = noteIdToNote.get(note.discussionId);
      path = parent?.path!;
    }
    return path;
  }

  async function editNote(
    noteId: number,
    data: {
      note?: string;
      labels?: string[];
      state?: NoteState;
    }
  ) {
    const newNote = await prService.editPRComment(projectId, prId, noteId, data);
    manualUpdateNote(newNote);
    newNote.discussions?.forEach((note) => manualUpdateNote(note));
  }

  const pathShaToNoteCount = (function () {
    const ret = new Map<string, number>();

    function handleNote(note?: Note) {
      if (!note || !note.lineCode) return;
      const key = note.lineCode.split('_')[0];
      ret.set(key, (ret.get(key) ?? 0) + 1);
    }

    topLevelCommentNoteIdSet.forEach((noteId) => {
      const note = noteIdToNote.get(noteId);
      handleNote(note);
    });
    return ret;
  })();

  return {
    lineToNoteIdSet,
    noteIdToNote,
    noteIdToReviewId,
    reviewIdToReview,
    noteIdToReplyIdSet,
    pendingNoteIdSet,
    recordNoteIdSet,
    topLevelCommentNoteIdSet,
    openedProblemNoteIdSet,
    hasPendingReview,
    hasOpenedProblem: openedProblemNoteIdSet.size > 0,
    doRefresh,
    manualUpdateReview,
    manualAddNote,
    manualUpdateNote,
    pendingReviewRef,
    getRelatedFilePathByNoteId,
    editNote,
    updateFlag,
    pathShaToNoteCount,
    setUpdateFlag,
  };
};

const [NoteProvider, useNote] = createContainer(() => {
  const {
    project: { id: projectId },
    pr: { id: prId },
  } = useGlobal();
  const commentPack = useCommentPack(projectId, prId);
  useEffect(() => {
    commentPack.doRefresh();
  }, []);

  async function addComment(data: NoteCreatePick) {
    if (!commentPack.hasPendingReview) {
      const review = await prService.createReview(projectId, prId);
      commentPack.manualUpdateReview(review);
    }
    const note = await prService.addComment(projectId, prId, data);
    commentPack.manualAddNote(note, commentPack.pendingReviewRef.current);
  }

  async function commitReview(body: string) {
    if (!commentPack.hasPendingReview) {
      await prService.createReview(projectId, prId);
    }
    await prService.commitReview(projectId, prId, body);
    await commentPack.doRefresh(true);
  }

  const activateRef = useRef<() => void>();

  return {
    commentPack,
    ...commentPack,
    addComment,
    commitReview,
    prId,
    activateRef,
  };
});

const [ReadMarkProvider, useReadMark] = createContainer(() => {
  const {
    project: { id: projectId },
    pr: { id: prId },
  } = useGlobal();

  const [flag, updateFlag] = useState({});

  const readMarks = useRequest(() => prService.getFileReadMarks(projectId, prId), {
    deps: [projectId, projectId, flag],
  });

  const readMarkMap = useMemo(() => {
    const map = new Map<string, FileReadMark>();
    if (!readMarks) return map;
    for (const mark of readMarks) {
      map.set(mark.filePathSha, mark);
    }
    return map;
  }, [readMarks]);

  const memoizedSha1 = useMemo(() => memoize(sha1), []);

  async function markFileAsRead(filePath: string) {
    const data = await prService.markFileAsRead(projectId, prId, memoizedSha1(filePath));
    updateFlag({});
    return data;
  }

  async function markFileAsUnread(filePath: string) {
    const data = await prService.markFileAsUnread(projectId, prId, memoizedSha1(filePath));
    updateFlag({});
    return data;
  }

  const getFileReadMark = useCallback(
    (filePath: string) => {
      const filePathSha = memoizedSha1(filePath);
      return readMarkMap.get(filePathSha);
    },
    [readMarkMap]
  );

  const getFileReadStatus = useCallback(
    (filePath: string) => {
      const readMark = getFileReadMark(filePath);
      return readMark && readMark.markAsRead && !readMark.updatedAfterRead;
    },
    [getFileReadMark]
  );

  return {
    readMarks,
    readMarkMap,
    getFileReadMark,
    getFileReadStatus,
    markFileAsRead,
    markFileAsUnread,
  };
});

const [AcrProvider, useAcr] = createContainer(() => {
  const { project, pr } = useGlobal();
  const { charsetName } = useSetting();
  const { commentPack } = useNote();

  const [IDEMode, setIDEMode] = useState(true);
  const toggleViewerType = useCallback(() => {
    setIDEMode((v) => !v);
  }, [setIDEMode]);

  const [search, setSearch] = useState(location.search);
  const query = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    const ret: { from?: number; to?: number } = {};
    if (searchParams.has('from')) {
      ret.from = parseInt(searchParams.get('from')!);
    }
    if (searchParams.has('to')) {
      ret.to = parseInt(searchParams.get('to')!);
    }
    return ret;
  }, [search]);

  function updateQuery(data: { from?: number; to?: number }) {
    const searchParam = new URLSearchParams();
    if (data.from) {
      searchParam.set('from', String(data.from));
    }
    if (data.to) {
      searchParam.set('to', String(data.to));
    }
    const search = searchParam.toString();
    history.replaceState(null, '', `${location.pathname}${search ? '?' : ''}${search}`);
    setSearch(search);
  }

  const versions = useRequest(
    async () => (await prService.getDiffVersions(project.id, pr.id)).list,
    { initial: [] }
  );

  const versionMap = useMemo(() => {
    const map = new Map<number, DiffVersion>();
    for (const version of versions) {
      map.set(version.id, version);
    }
    return map;
  }, [versions]);
  const latestVersionId = versions[0]?.id ?? pr.diff.id;

  const from = query.from;
  const to = query.to ?? latestVersionId;
  const fromVersion = from ? versionMap.get(from) : null;
  const toVersion = versionMap.get(to)!;

  const ignoreWhiteSpace = false;
  const diffsPack: {
    diffs: Diff[] | DiffOverview[];
    overflow: boolean;
    addLineNum: number;
    delLineNum: number;
    fromVersion?: DiffVersion;
    toVersion: DiffVersion;
    isPartial: boolean;
  } = useRequest(
    async () => {
      if (!toVersion) return null;
      const isPartial = !!fromVersion || toVersion.id !== latestVersionId;
      const options = {
        ignoreWhiteSpaceChange: ignoreWhiteSpace,
        charsetName,
      };
      let res;
      if (fromVersion) {
        res = await prService.getDiffs(
          project.id,
          fromVersion.headCommitSha,
          toVersion.headCommitSha,
          options
        );
      } else {
        if (ignoreWhiteSpace) {
          res = await prService.getDiffs(
            project.id,
            toVersion.baseCommitSha,
            toVersion.headCommitSha,
            options
          );
        } else {
          const diffs = await prService.getDiffOverviews(project.id, pr.id, toVersion.id);

          res = {
            diffs,
            overflow: false,
            addLineNum: toVersion.addLineNum,
            delLineNum: toVersion.delLineNum,
          };
        }
      }
      return {
        ...res,
        fromVersion,
        toVersion,
        isPartial,
      };
    },
    {
      deps: [fromVersion, toVersion, charsetName],
    }
  );

  useEffect(() => {
    commentPack.doRefresh();
  }, []);

  async function addComment(data: NoteCreatePick) {
    console.log('>>>addComment', data);
  }

  async function commitReview(body: string) {
    console.log('>>>commitReview', body);
  }

  function getDiffById(diffId: number) {
    return prService.getDiffById(project.id, pr.id, toVersion.id, diffId, {
      charsetName,
    });
  }

  async function getFileContent(path: string, sha: string, maxSize?: number) {
    try {
      return await projectService.getFileBlob(project.id, sha, path, {
        maxSize: maxSize || 250000,
        charsetName,
      });
    } catch (e: any) {
      if (isApiError(e) && e.response.status === 413) {
        return null;
      }
      if (e.response.status === 404) {
        return null;
      }
      throw e;
    }
  }

  const annotationPacks: AnnotationPack[] = [];
  let countMap = new Map<string, number>();
  for (const checkSuite of pr.checkSuites) {
    if (checkSuite.checkRuns) {
      for (const checkRun of checkSuite.checkRuns) {
        if (checkRun.annotations) {
          for (const annotation of checkRun.annotations) {
            const pack = {
              annotation,
              checkSuite,
            };
            annotationPacks.push(pack);
            countMap.set(annotation.path, (countMap.get(annotation.path) ?? 0) + 1);
          }
        }
      }
    }
  }

  return {
    diffsPack,
    versions,
    fromVersion,
    toVersion,
    getDiffById,
    getFileContent,
    IDEMode,
    toggleViewerType,
    updateQuery,
    annotationPacks,
  };
});

export const Provider: FC = (props) => {
  return (
    <GlobalProvider>
      <SettingProvider>
        <NoteProvider>
          <ReadMarkProvider>
            <AcrProvider>{props.children}</AcrProvider>
          </ReadMarkProvider>
        </NoteProvider>
      </SettingProvider>
    </GlobalProvider>
  );
};

export { useGlobal, useNote, useReadMark, useAcr, useSetting };
