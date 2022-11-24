import { Injectable } from '@opensumi/di';
import { Event } from '@opensumi/ide-core-common';
import { CommentsZoneWidget } from '@opensumi/ide-comments/lib/browser/comments-zone.view';
import type { ICommentsThread } from '@opensumi/ide-comments/lib/common';
import { IEditor } from '@opensumi/ide-editor';

export { CommentsZoneWidget };

// TODO: 临时修复
@Injectable({ multiple: true })
export class CommentsZoneWidgetPatch extends CommentsZoneWidget {
  constructor(editor: IEditor, thread: ICommentsThread) {
    const { monacoEditor } = editor;
    // @ts-ignore
    monacoEditor.onDidChangeConfiguration = Event.map(
      monacoEditor.onDidChangeConfiguration,
      (e) => {
        e.hasChanged = e.hasChanged.bind(e);
        return e;
      }
    );
    super(editor, thread);
  }
}
