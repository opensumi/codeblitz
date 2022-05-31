import { Domain } from '@opensumi/ide-core-common';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
} from '@opensumi/ide-editor/lib/browser';
import { ExpandBtn } from './editor-expand-btn';

/**
 * 通过样式，将 editor-expand-btn 放到编辑器左侧位置
 */

@Domain(BrowserEditorContribution)
export class EditorExpandBtnContribution implements BrowserEditorContribution {
  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorSideWidget({
      id: 'editor-expand-btn',
      component: ExpandBtn,
      displaysOnResource: () => true,
    });
  }
}
