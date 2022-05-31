import { Domain } from '@opensumi/ide-core-common';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
} from '@opensumi/ide-editor/lib/browser';
import { EditorBottomSideWidget } from './editor-bottom-side.view';

@Domain(BrowserEditorContribution)
export class EditorBottomSideContribution implements BrowserEditorContribution {
  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorSideWidget({
      id: 'diff-editor-bottom',
      component: EditorBottomSideWidget,
      displaysOnResource: (resource) => {
        // 如果有 diff id，则展示编辑器底部组件
        return !!resource.uri.getParsedQuery().newPath;
      },
    });
  }
}
