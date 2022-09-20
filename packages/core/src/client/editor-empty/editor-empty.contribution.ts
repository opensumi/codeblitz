import { Domain, ComponentContribution, ComponentRegistry } from '@opensumi/ide-core-browser';
import { RuntimeConfig } from '../../common';
import { EditorEmptyComponent } from './editor-empty.view';
import { Autowired } from '@opensumi/di';

@Domain(ComponentContribution)
export class EditorEmptyContribution implements ComponentContribution {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  registerComponent(registry: ComponentRegistry) {
    const editorEmpty = this.runtimeConfig.EditorEmpty;

    registry.register('editor-empty', {
      id: 'editor-empty',
      component: editorEmpty ? editorEmpty : EditorEmptyComponent,
    });
  }
}
