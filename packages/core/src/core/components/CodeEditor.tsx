import React, { useContext, useEffect, useMemo, useRef } from 'react';

import * as path from 'path'
import { URI, useInjectable } from '@opensumi/ide-core-browser';
import { ConfigProvider, AppConfig } from '@opensumi/ide-core-browser/lib/react-providers/config-provider'
import { EditorCollectionService, ICodeEditor, IEditorDocumentModelRef } from '@opensumi/ide-editor/lib/common'
import { IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser/doc-model/types'
import { AppContext } from './context'
import { useMemorizeFn } from '../hooks'
import { parseUri } from './util'

const noop = () => {}

export interface ICodeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  uri: URI | string;

  editorOptions?: any;

  onEditorCreate?: (editor: ICodeEditor) => void;
}

export const CodeEditorComponent = ({ uri, editorOptions, onEditorCreate, ...props }: ICodeEditorProps) => {
  const editorCollectionService: EditorCollectionService = useInjectable(EditorCollectionService);
  const documentService: IEditorDocumentModelService = useInjectable(IEditorDocumentModelService);
  const appConfig: AppConfig = useInjectable(AppConfig);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const uriStr = useMemo(() => parseUri(uri, appConfig.workspaceDir), [uri])
  const fetchingUriRef = useRef<string>('');
  const documentModelRef = useRef<IEditorDocumentModelRef>();
  const editorRef = useRef<ICodeEditor>()
  const unmountRef = useRef(false);
  const onEditorCreateMemorizeFn = useMemorizeFn(onEditorCreate || noop)

  const openDocumentModel = () => {
    if (editorRef.current && documentModelRef.current) {
      editorRef.current.open(documentModelRef.current)
    }
  }

  React.useEffect(() => {
    if (containerRef.current) {
      editorRef.current?.dispose();
      editorRef.current = editorCollectionService.createCodeEditor(containerRef.current, {
        automaticLayout: true,
        ...editorOptions,
      });
      onEditorCreateMemorizeFn(editorRef.current)
      openDocumentModel()
    }
    return () => {
      unmountRef.current = true;
      editorRef.current?.dispose()
      documentModelRef.current?.dispose()
    };
  }, []);

  useEffect(() => {
    if (fetchingUriRef.current !== uriStr) {
      fetchingUriRef.current = uriStr
      documentService.createModelReference(new URI(uriStr), 'editor-react-component').then((ref) => {
        if (documentModelRef.current) {
          documentModelRef.current.dispose();
        }
        if (!unmountRef.current && ref.instance.uri.toString() === uriStr) {
          documentModelRef.current = ref;
          openDocumentModel()
        } else {
          ref.dispose();
        }
      });
    }
  }, [uriStr])

  return <div ref={containerRef} {...props}></div>;
};

export const CodeEditor = (props: ICodeEditorProps) => {
  const appContext = useContext(AppContext)
  if (!appContext.app) return null
  return (
    <ConfigProvider value={appContext.app.config}>
      <CodeEditorComponent {...props} />
    </ConfigProvider>
  )
};
