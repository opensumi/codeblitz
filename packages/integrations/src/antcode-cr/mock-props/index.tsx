import * as React from 'react';

import { IAntcodeCRProps } from '@alipay/alex-acr/lib/modules/antcode-service/base';

import {
  getFileContent,
  bulkChangeFiles,
  getLanguages,
  lsifExists,
  lsifHover,
  lsifDefinitions,
  lsifReferencesV2,
} from '../mock-props/requests';
import { lineToNoteIdSet, noteIdToNote } from '../mock-props/comments';
import { user } from '../mock-props/user';
import { defaultEncoding } from '../mock-props/meta';
import { annotations } from './annotations';
import { read } from './read';

// fetch('https://code.alipay.com/api/v3/projects/128302/pull_requests/2354056/changes')
// fetch('https://code.alipay.com/api/v3/projects/128302/pull_requests/2354056')

export const getProps = (projectId: number): Partial<IAntcodeCRProps> => ({
  // locale: 'en-US',
  defaultEncoding,
  // encoding,
  // setEncoding,
  locale: 'zh-CN',
  projectId,
  // projectPath,
  // addLineNum: 567,
  // deleteLineNum: 350,
  // prevSha: 'df72e4d1c394af6d1c21cd042116f83a792fa8c6',
  // nextSha: '600a21671566fd666cbccb4d77f9d7d43dcb74cd',
  // latestCommitSha: '600a21671566fd666cbccb4d77f9d7d43dcb74cd',
  // nextSha: 'cb055545e23fdd68c5b1ac7c682885896dde94eb',
  // latestCommitSha: 'cb055545e23fdd68c5b1ac7c682885896dde94eb',
  // pr,
  user,
  Commenting: ({ inputRef }) => {
    return (
      <h3>
        Commenting
        <textarea ref={inputRef} />
      </h3>
    );
  },
  DiscussionItem: () => <h3>DiscussionItem</h3>,
  AnnotationEntry: () => <div>AnnotationEntry</div>,
  Menubar: () => <div>version selector</div>,
  getFileContent: getFileContent(projectId),
  getLanguages: getLanguages(projectId),
  bulkChangeFiles: bulkChangeFiles(projectId),
  lineToNoteIdSet,
  noteIdToNote,
  noteUpdateFlag: {},
  ...read,
  annotations,
  PRMoreActionLinks: () => (
    <>
      <div style={{ margin: '16 0' }}>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          检出分支
        </a>
      </div>
      <div style={{ margin: '16 0' }}>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          下载 patch 文件
        </a>
      </div>
      <div style={{ margin: '16 0' }}>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          下载 diff 文件
        </a>
      </div>
    </>
  ),
});
