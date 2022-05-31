import { URI, removeUndefined } from '@opensumi/ide-core-common';
import { localize } from '@opensumi/ide-core-browser';
import { IPullRequestChangeDiff } from '../../antcode-service/base';

/**
 * 通过 uri 获取 commit id
 */
function getRefByUri(uri: URI) {
  try {
    const query = uri.getParsedQuery();
    return query.ref;
  } catch {
    return '';
  }
}

/**
 * 获取 Diff 编辑器显示名称
 * 默认为 name(commitId) <=> name(commitId)
 */
function getDiffEditorName(left: URI, right: URI) {
  const leftRef = getRefByUri(left);
  const rightRef = getRefByUri(right);

  return `${left.displayName}${leftRef ? `(${leftRef.slice(0, 8)})` : ''} <=> ${right.displayName}${
    rightRef ? `(${rightRef.slice(0, 8)})` : ''
  }`;
}

export function toDiffUri(left: URI, right: URI) {
  return URI.from({
    scheme: 'diff',
    query: URI.stringifyQuery({
      name: getDiffEditorName(left, right),
      original: left,
      modified: right,
    }),
  });
}

interface DiffUriParams {
  name: string;
  left: URI;
  right: URI;
  isCR: boolean;
}

export function fromDiffUri(uri: URI): DiffUriParams {
  if (uri.scheme !== 'diff') {
    // @ts-ignore
    return null;
  }
  const { name, original, modified } = uri.getParsedQuery();
  const originalURI = new URI(original);
  const modifiedURI = new URI(modified);
  return {
    name,
    left: originalURI,
    right: modifiedURI,
    // 左右两侧都包含 newPath 时，则表示是 change file uri
    isCR: Boolean(originalURI.getParsedQuery().newPath && modifiedURI.getParsedQuery().newPath),
  };
}

// FIXME: 不是所有的 git uri 都有 diff id
export function toGitUri(uri: URI, ref: string, newPath?: string): URI {
  // const dirPath = appConfig.workspaceDir;
  // 存在部分文件名包含 # 部分
  const path = uri.withoutScheme().toString(true);

  const query = removeUndefined({
    // path: dirPath + '/' + uri.codeUri.fsPath,
    // 移除新版本 vscode-uri 导致的额外 `/`
    path: path.startsWith('/') ? path.slice(1) : path,
    ref,
    // newPath 作为 diff 的 id
    newPath,
  });

  // 避免 fragment 部分被 override 掉
  return URI.from({
    ...uri.codeUri,
    scheme: 'git',
    // path: dirPath + '/' + uri.codeUri.path,
    path,
    query: URI.stringifyQuery(query),
  });
}

interface GitUriParams {
  ref: string;
  isCR: boolean;
  path: string;
}

export function fromGitUri(uri: URI): GitUriParams {
  const query = uri.getParsedQuery() as unknown as GitUriParams;
  const path = uri.codeUri.path;
  const result: GitUriParams = {
    isCR: query.isCR,
    // 移除新版本 vscode-uri 导致的额外 `/`
    path: path.startsWith('/') ? path.slice(1) : path,
    ref: query.ref,
  };

  return result;
}

// 如果是 CR 场景，在 query 上标记了 newPath
export function isChangeFileURI(uri: URI) {
  if (uri.scheme === 'diff') {
    return fromDiffUri(uri).isCR;
  }
  // 包含 newPath 时，则表示是 change file uri
  const q = uri.getParsedQuery();
  return Boolean(q && q.newPath);
}

/**
 * 将 antcode 传过来的 pr change diff 字段分割为左右两个 uri 供 diff 使用
 */
export function splitChangeToTwoUris(
  change: IPullRequestChangeDiff,
  leftRef: string,
  rightRef: string
): {
  uris: URI[];
  desc: string;
  status: 'deleted' | 'renamed' | 'created' | 'modified';
} {
  // 不同于 git 插件 重命名是 两个变更文件，一个删除一个新增
  // 删除时，则显示 (read-only): 我们应该在 tab 标题上，显示 (重命名|删除)
  // 如果当前资源是删除文件，需要使用左边的 commit id，否则用右边的 commit id
  if (change.deletedFile) {
    const uri = toGitUri(new URI(change.oldPath), leftRef, change.newPath);
    return {
      // @ts-ignore
      uris: [, uri],
      desc: localize('changes.tree.file.deleted'),
      status: 'deleted',
    };
  }

  // rename 文件只打开新的文件
  if (change.renamedFile) {
    const leftUri = toGitUri(new URI(change.oldPath), leftRef, change.newPath);
    const rightUri = toGitUri(new URI(change.newPath), rightRef, change.newPath);
    return {
      uris: [leftUri, rightUri],
      desc: localize('changes.tree.file.renamed'),
      status: 'renamed',
    };
  }

  if (change.newFile) {
    // 这个逻辑有坑，先去掉了
    // 特殊处理 `~` 标识为上一个 commit 文件，只需要提供空内容即可
    // const left = toGitUri(new URI(change.newPath), '~');
    const right = toGitUri(new URI(change.newPath), rightRef, change.newPath);
    return {
      // @ts-ignore
      uris: [, right],
      desc: localize('changes.tree.file.created'),
      status: 'created',
    };
  }

  const left = toGitUri(new URI(change.oldPath), leftRef, change.newPath);
  const right = toGitUri(new URI(change.newPath), rightRef, change.newPath);
  return {
    uris: [left, right],
    desc: localize('changes.tree.file.modified'),
    status: 'modified',
  };
}
