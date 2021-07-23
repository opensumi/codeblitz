import { Injectable } from '@ali/common-di';
import { Event } from '@ali/ide-core-common';
import { CommentsZoneWidget } from '@ali/ide-comments/lib/browser/comments-zone.view';
import type { ICommentsThread } from '@ali/ide-comments/lib/common';
import { IEditor } from '@ali/ide-editor';

export { CommentsZoneWidget };

// 临时修复
@Injectable({ multiple: true })
export class CommentsZoneWidgetPatch extends CommentsZoneWidget {
  constructor(editor: IEditor, thread: ICommentsThread) {
    const { monacoEditor } = editor;
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
