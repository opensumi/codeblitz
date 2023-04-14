import { Injectable } from '@opensumi/di';
import { IContextKeyService } from '@opensumi/ide-core-browser';
import { ContextKeyService } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService';
import { MonacoContextKeyService as BaseContextKeyService } from '@opensumi/ide-monaco/lib/browser/monaco.context-key.service';
// TODO 暂时此处覆盖其 dispose 防止报错
@Injectable()
export class MonacoContextKeyService extends BaseContextKeyService implements IContextKeyService {
  public readonly contextKeyService: ContextKeyService;

  constructor() {
    super();
    // TODO 不放window
    // ContextKeyService 全局唯一 组件重置后需重新绑定
    this.contextKeyService =
      (window as any)?._alex?.ContextKeyService || new ContextKeyService(this.configurationService);
    (window as any)._alex = {};
    (window as any)._alex.ContextKeyService = this.contextKeyService;
    this.listenToContextChanges();
  }

  dispose(): void {}
}
