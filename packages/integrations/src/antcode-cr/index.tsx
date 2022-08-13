import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Button, Switch } from 'antd';
import 'antd/dist/antd.css';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

import AntcodeCR from '@alipay/alex-acr';
import { IAntcodeCRProps } from '@alipay/alex-acr/lib/modules/antcode-service/base';
import { Uri } from '@alipay/alex';
import * as path from 'path';
import { usePersistFn } from 'ahooks';

import { Provider, useGlobal, useNote, useReadMark, useAcr, useSetting } from './model';
import {
  DiscussionItem,
  Commenting,
  Menubar,
  AnnotationEntry,
  PRMoreActionLinks,
} from './antcode/components';
import { projectService } from './antcode/project.service';
import { lsifService } from './antcode/lsif.service';
import { repoService } from './antcode/repo.service';
import { FileActionHeader, FileAction } from './antcode/types/file-action';
import { useFileReadMarkChange$ } from './hooks';
import { useLoadLocalExtensionMetadata } from '../common/local-extension.module';
import acrPlugin from '../common/plugin';
import CodeBlamePlugin, { ExtensionCommand } from '../common/code-blame.plugin';
import CodeScaningPlugin from '../common/code-scaning.plugin';
import CodeScaning from '@alipay/alex/extensions/cloud-ide-ext.antcode-scaning';
import CodeBlame from '@alipay/alex/extensions/cloud-ide-ext.editor-plugin-blame';
import { mockService } from './antcode/mock.service';
import './style.less';

const App = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [count, setCount] = React.useState<number>(0);
  const [isFullscreen, setFullscreen] = React.useState<boolean>(false);

  const { project, pr, user } = useGlobal();
  const { locale, setLocale, gbk, setGBK } = useSetting();

  const { commentPack } = useNote();
  const {
    getFileReadStatus: _getFileReadStatus,
    markFileAsRead,
    markFileAsUnread,
    readMarks,
  } = useReadMark();
  const getFileReadStatus = usePersistFn(_getFileReadStatus);

  const { diffsPack, getDiffById, getFileContent, IDEMode, toggleViewerType, annotationPacks } =
    useAcr();
  const fileReadMarkChange$ = useFileReadMarkChange$(diffsPack?.diffs ?? [], readMarks);

  useEffect(() => {
    if (!CodeScaningPlugin?.ready) {
      return;
    }
    // map 需要转译
    CodeScaningPlugin.commands?.executeCommand(
      'antcode-cr.update',
      'comments',
      Array.from(commentPack.noteIdToNote.entries())
    );

    let noteIdToReplyIdSet: [number, number[]][] = [];
    for (let [key, value] of commentPack.noteIdToReplyIdSet) {
      noteIdToReplyIdSet.push([key, [...value]]);
    }
    CodeScaningPlugin.commands?.executeCommand(
      'antcode-cr.update',
      'replyIdSet',
      noteIdToReplyIdSet
    );
  }, [commentPack.updateFlag]);
  useEffect(() => {
    if (!CodeScaningPlugin?.ready) {
      return;
    }
    CodeScaningPlugin.commands?.executeCommand('antcode-cr.update', 'annotations', annotationPacks);
  }, [annotationPacks]);

  // 插件
  const [pluginActivated, setPluginActivated] = useState(false);
  const blamePlugin = useMemo(() => {
    return new CodeBlamePlugin(
      () => setPluginActivated(true),
      (commitId: string) =>
        window.open(`/${project.namespace.path}/${project.path}/commit/${commitId}`),
      (projectId, commitId, path) => repoService.getCodeBlame(projectId, commitId, path)
    );
  }, []);
  useEffect(() => {
    if (!pluginActivated) {
      return;
    }
    const projectData = {
      projectId: project.id,
      prevSha: diffsPack.fromVersion?.headCommitSha ?? diffsPack.toVersion.baseCommitSha,
      nextSha: diffsPack.toVersion.headCommitSha,
    };
    blamePlugin.commands?.executeCommand(ExtensionCommand.setProjectData, projectData);
  }, [pluginActivated, diffsPack]);

  const extensionMetadata = useLoadLocalExtensionMetadata();
  if (!extensionMetadata) return null;
  if (!diffsPack) return null;

  CodeScaningPlugin.setProps({
    noteIdToNote: commentPack.noteIdToNote,
    annotations: annotationPacks,
    projectMeta: {
      projectId: project.pathWithNamespace,
      prId: pr?.iid,
      pullRequestId: pr?.id,
    },
    pullRequestChangeList: diffsPack?.diffs,
    noteIdToReplyIdSet: commentPack.noteIdToReplyIdSet,
  });

  const props = {
    noteIdToReplyIdSet: commentPack.noteIdToReplyIdSet,
    addLineNum: diffsPack.addLineNum,
    deleteLineNum: diffsPack.delLineNum,
    prevSha: diffsPack.fromVersion?.headCommitSha ?? diffsPack.toVersion.baseCommitSha,
    nextSha: diffsPack.toVersion.headCommitSha,
    toggleViewerType,
    DiscussionItem,
    Commenting,
    getFileContent,
    lineToNoteIdSet: commentPack.lineToNoteIdSet,
    noteIdToNote: commentPack.noteIdToNote,
    noteUpdateFlag: commentPack.updateFlag,
    getDiffById,
    diffs: diffsPack.diffs,
    latestCommitSha: pr.diff.headCommitSha,
    projectId: project.id,
    projectPath: project.pathWithNamespace,
    pullRequestId: pr.id,
    pr,
    getLanguages: () =>
      projectService
        .getLanguages(project.id, {
          aggBy: 'file_extension',
          // 按照语言文件个数排序
          orderBy: 'count',
          size: 20,
        })
        .then((res) => res && Object.keys(res)),
    getFileReadStatus,
    fileReadMarkChange$,
    markFileAsRead,
    markFileAsUnread,
    bulkChangeFiles: (actions: FileAction[], header: FileActionHeader) =>
      projectService.bulkChangeFiles(project.id, actions, header),
    Menubar: () => (
      <Menubar
        initialFullscreen={isFullscreen}
        handleFullscreenChange={setFullscreen}
        toggleViewerType={toggleViewerType}
        logFullScreen={(bool) => console.log('>>>logFullScreen', bool)}
      />
    ),
    user,
    lsifService,
    defaultEncoding: project.encoding,
    encoding: gbk ? 'gbk' : 'utf-8',
    setEncoding: (val: 'gbk' | 'utf-8') => {
      setGBK(val === 'gbk');
    },
    locale,
    // annotation related
    annotations: annotationPacks,
    AnnotationEntry,
    PRMoreActionLinks,
    // 全屏模式
    isFullscreen,
    // 自定义空白页
    // EditorEmpty: () => {
    //   return <div>23232323</div>
    // },
    appConfig: {
      staticServicePath: Uri.parse(window.location.href)
        .with({ path: path.join('/antcode', project.pathWithNamespace, 'raw') })
        .toString(),
      plugins: [acrPlugin, CodeScaningPlugin, blamePlugin],
      // extensionMetadata: [CodeScaning, CodeBlame],
      extensionMetadata,
    },
  } as IAntcodeCRProps;

  const IDEContainerStyle: React.CSSProperties = {
    position: isFullscreen ? 'fixed' : 'static',
    left: 0,
    top: 0,
    width: '100%',
    height: isFullscreen ? '100vh' : 'calc(100vh - 72px)',
    zIndex: 1000,
  };

  return (
    <div style={{ height: '100%' }}>
      <div className="controller">
        <Button onClick={() => setVisible((r) => !r)}>destroy by toggle</Button>
        <Button onClick={() => setCount((v) => v + 1)}>reset</Button>
        <Button onClick={setLocale}>toggle locale: current locale {locale}</Button>
        <Button
          onClick={() => {
            acrPlugin.commands?.executeCommand('plugin.command.test', 1, 2);
          }}
        >
          plugin command test
        </Button>

        <div style={{ border: '1px solid #000', textAlign: 'center' }}>
          <div>code scaning mock</div>
          <Button
            onClick={() => {
              let mock = mockService.getOneComment();
              let noteIdToNote = Array.from(commentPack.noteIdToNote.entries());
              // @ts-ignore
              noteIdToNote.push([400003, mock]);
              CodeScaningPlugin.commands?.executeCommand(
                'antcode-cr.update',
                'comments',
                noteIdToNote
              );
            }}
          >
            comments change
          </Button>
          <Button
            onClick={() => {
              let mock = mockService.getScaningProblem();
              CodeScaningPlugin.commands?.executeCommand('antcode-cr.update', 'annotations', mock);
            }}
          >
            annotations
          </Button>
          <Button
            onClick={() => {
              let mock = [[78, [86, 179, 178]]];
              CodeScaningPlugin.commands?.executeCommand('antcode-cr.update', 'replyIdSet', mock);
              commentPack.setUpdateFlag({});
            }}
          >
            replyIdSet
          </Button>
        </div>

        {!IDEMode && (
          <>
            IDE 模式: <Switch checked={IDEMode} onChange={toggleViewerType} />
          </>
        )}
      </div>
      <div className="pr-head">
        <div>{pr.description}</div>
        <div>
          评审人：
          {pr.review?.reviewers?.map((r) => (
            <span style={{ marginRight: 4 }} key={r.id}>
              {r.name}
            </span>
          ))}
          <span style={{ marginRight: 24 }}></span>
          合并人：{pr.assignee?.name}
        </div>
      </div>
      {IDEMode && (
        <div style={IDEContainerStyle}>{visible && <AntcodeCR {...props} key={count} />}</div>
      )}
    </div>
  );
};

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('main')!
);
