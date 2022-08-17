/**
 * 注册编辑器空白页背景图
 */
import { Autowired } from '@alipay/alex/lib/modules/opensumi__common-di';
import { Domain, ComponentContribution, ComponentRegistry } from '@opensumi/ide-core-browser';
import { IAntcodeService } from '../antcode-service/base';
import { EditorEmptyComponent } from './editor-empty.view';

@Domain(ComponentContribution)
export class EditorEmptyContribution implements ComponentContribution {
  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  registerComponent(registry: ComponentRegistry) {
    registry.register('editor-empty', {
      id: 'editor-empty',
      component: this.antcodeService.EditorEmpty
        ? this.antcodeService.EditorEmpty
        : EditorEmptyComponent,
      initialProps: [],
    });
  }
}
