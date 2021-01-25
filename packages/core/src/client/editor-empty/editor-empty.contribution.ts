import { Domain, ComponentContribution, ComponentRegistry } from '@ali/ide-core-browser';
import { EditorEmptyComponent } from './editor-empty.view';

@Domain(ComponentContribution)
export class EditorEmptyContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register('editor-empty', {
      id: 'editor-empty',
      component: EditorEmptyComponent,
    });
  }
}
