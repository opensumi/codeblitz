import * as monaco from '@ali/monaco-editor-core/esm/vs/editor/editor.api';
import { IRange, URI } from '@ali/ide-core-common';
import { IEditor } from '@ali/ide-editor';
import { TextDocument } from 'vscode';
import {
  CUSTOM_FOLDING_LINE_NUMBER,
  FOLDING_CONTRIB_ID,
  IFoldingContribution,
  TEditorType,
} from '.';
import { fromGitUri } from '../merge-request/changes-tree/util';

export const getMaxLineCount = (e: IEditor) => {
  return e.monacoEditor.getModel()?.getLineCount();
};

export const generateRange = (s: number, e: number): IRange => {
  return new monaco.Range(s, 1, e, 1);
};

// 以当前 document 的 ref 判断是 original 还是 modified
export const isSideWithTypeFactory = (document: TextDocument, oriUri: URI, modUri: URI) => {
  const uri = new URI(document.uri);
  const { ref } = fromGitUri(uri);

  return (type: TEditorType) => {
    if (type === 'original') {
      return ref === fromGitUri(oriUri).ref;
    } else {
      return ref === fromGitUri(modUri).ref;
    }
  };
};

export const sleep = (time: number) => new Promise(() => setTimeout(() => {}, time));

export const getFoldingController = (monacoEditor: monaco.editor.ICodeEditor) => {
  return monacoEditor.getContribution<IFoldingContribution>(FOLDING_CONTRIB_ID);
};

export const isVisibilityRangeByUpOrDownWidget = (line: number): boolean => {
  return line > CUSTOM_FOLDING_LINE_NUMBER;
};
