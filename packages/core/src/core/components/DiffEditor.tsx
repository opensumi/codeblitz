import React, { useContext, useEffect, useMemo, useRef, MutableRefObject } from 'react';

import * as path from 'path'
import { URI, useInjectable } from '@opensumi/ide-core-browser';
import { ConfigProvider, AppConfig } from '@opensumi/ide-core-browser/lib/react-providers/config-provider'
import { EditorCollectionService, IDiffEditor, IEditorDocumentModelRef } from '@opensumi/ide-editor/lib/common'
import { IEditorDocumentModelService } from '@opensumi/ide-editor/lib/browser/doc-model/types'
import { AppContext } from './context'
import { useMemorizeFn } from '../hooks'
import { parseUri } from './util'

const noop = () => {}

export interface ICodeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  originalUri: URI | string;

  modifiedUri: URI | string;

  editorOptions?: any;

  onEditorCreate?: (editor: IDiffEditor) => void;
}

export const DiffEditorComponent = ({ originalUri, modifiedUri, editorOptions, onEditorCreate, ...props }: ICodeEditorProps) => {
  const editorCollectionService: EditorCollectionService = useInjectable(EditorCollectionService);
  const documentService: IEditorDocumentModelService = useInjectable(IEditorDocumentModelService);
  const appConfig: AppConfig = useInjectable(AppConfig);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<IDiffEditor>()
  const unmountRef = useRef(false);
  const onEditorCreateMemorizeFn = useMemorizeFn(onEditorCreate || noop)

  const originalUriStr = useMemo(() => parseUri(originalUri, appConfig.workspaceDir), [originalUri])
  const originalFetchingUriRef = useRef<string>('');
  const originalDocumentModelRef = useRef<IEditorDocumentModelRef>();

  const modifiedUriStr = useMemo(() => parseUri(modifiedUri, appConfig.workspaceDir), [modifiedUri])
  const modifiedFetchingUriRef = useRef<string>('');
  const modifiedDocumentModelRef = useRef<IEditorDocumentModelRef>();

  const openDocumentModel = () => {
    if (editorRef.current && originalDocumentModelRef.current && modifiedDocumentModelRef.current) {
      editorRef.current.compare(originalDocumentModelRef.current, modifiedDocumentModelRef.current)
    }
  }

  React.useEffect(() => {
    if (containerRef.current) {
      editorRef.current?.dispose();
      editorRef.current = editorCollectionService.createDiffEditor(containerRef.current, {
        automaticLayout: true,
        ...editorOptions,
      });
      onEditorCreateMemorizeFn(editorRef.current)
      openDocumentModel()
    }
    return () => {
      unmountRef.current = true;
      editorRef.current?.dispose()
      originalDocumentModelRef.current?.dispose()
      modifiedDocumentModelRef.current?.dispose()
    };
  }, []);

  useEffect(() => {
    const createModelReference = (
      fetchingUriRef: MutableRefObject<string>,
      uriStr: string,
      documentModelRef: MutableRefObject<IEditorDocumentModelRef | undefined>
    ) => {
      if (fetchingUriRef.current !== uriStr) {
        fetchingUriRef.current = uriStr
        documentService.createModelReference(new URI(uriStr), 'diff-editor-react-component').then((ref) => {
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
    }
    createModelReference(originalFetchingUriRef, originalUriStr, originalDocumentModelRef)
    createModelReference(modifiedFetchingUriRef, modifiedUriStr, modifiedDocumentModelRef)
  }, [originalUriStr, modifiedUriStr])

  return <div ref={containerRef} {...props}></div>;
};

export const DiffEditor = (props: ICodeEditorProps) => {
  const appContext = useContext(AppContext)
  if (!appContext.app) return null
  return (
    <ConfigProvider value={appContext.app.config}>
      <DiffEditorComponent {...props} />
    </ConfigProvider>
  )
};
