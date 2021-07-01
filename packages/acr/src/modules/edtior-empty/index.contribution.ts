/**
 * 注册编辑器空白页背景图
 */
import { Domain, ComponentContribution, ComponentRegistry } from '@ali/ide-core-browser';
import { EditorEmptyComponent } from './editor-empty.view';

@Domain(ComponentContribution)
export class EditorEmptyContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register('editor-empty', {
      id: 'editor-empty',
      component: EditorEmptyComponent,
      initialProps: [],
    });
  }
}
