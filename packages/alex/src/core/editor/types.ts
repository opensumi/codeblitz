import { Thenable } from '../types';

export interface DocumentModel {
  filepath: string;
  readFile(filepath: string): Uint8Array | Thenable<Uint8Array>;
  encoding?: 'gbk' | 'utf8';
  lineNumber?: number;
  onLineNumberChange?: (num: number) => void;
}

export interface FSDocumentModel extends DocumentModel {
  type?: 'fs';
}

export interface CodeDocumentModel extends DocumentModel {
  type: 'code';
  ref: string;
  owner: string;
  name: string;
}

export interface EditorProps {
  documentModel: FSDocumentModel | CodeDocumentModel;
}

export const isCodeDocumentModel = (
  model: EditorProps['documentModel']
): model is CodeDocumentModel => {
  return 'type' in model && model.type === 'code';
};
