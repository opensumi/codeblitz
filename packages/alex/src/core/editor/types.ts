export interface DocumentModel {
  filepath: string;
  readFile(path: string): Uint8Array | Thenable<Uint8Array>;
  encoding?: 'gbk' | 'utf8';
}

export interface EditorProps {
  documentModel: DocumentModel;
}
