/// <reference types='monaco-editor-core/monaco'/>

declare module monaco.editor {
  export interface IResourceInput {
    resource: monaco.Uri;
    options?: IResourceInputOptions;
  }

  export interface IResourceInputOptions {
    /**
     * Tells the editor to not receive keyboard focus when the editor is being opened. By default,
     * the editor will receive keyboard focus on open.
     */
    preserveFocus?: boolean;

    /**
     * Will reveal the editor if it is already opened and visible in any of the opened editor groups.
     */
    revealIfVisible?: boolean;

    /**
     * Text editor selection.
     */
    selection?: Partial<monaco.IRange>;
  }
}
