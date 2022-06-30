import { Autowired, Injectable } from '@opensumi/di';
import { IContextKeyService } from '@opensumi/ide-core-browser';
import { IConfigurationService } from '@opensumi/monaco-editor-core/esm/vs/platform/configuration/common/configuration';
import { MonacoContextKeyService as BaseContextKeyService } from '@opensumi/ide-monaco/lib/browser/monaco.context-key.service';
import { ContextKeyService } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService';
// TODO 暂时此处覆盖其 dispose 防止报错
@Injectable()
export class MonacoContextKeyService extends BaseContextKeyService implements IContextKeyService {
  @Autowired(IConfigurationService)
  protected readonly configurationService: IConfigurationService;

  public readonly contextKeyService: ContextKeyService;

  constructor() {
    super();
    this.contextKeyService = new ContextKeyService(this.configurationService);
    this.listenToContextChanges();
  }
  dispose(): void {
    // 覆盖MonacoContextKeyService
  }
}
