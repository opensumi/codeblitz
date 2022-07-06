import { Injectable } from '@opensumi/di';
import { IContextKeyService } from '@opensumi/ide-core-browser';
import { MonacoContextKeyService as BaseContextKeyService } from '@opensumi/ide-monaco/lib/browser/monaco.context-key.service';
// TODO 暂时此处覆盖其 dispose 防止报错
@Injectable()
export class MonacoContextKeyService extends BaseContextKeyService implements IContextKeyService {
  dispose(): void {
    // 覆盖MonacoContextKeyService
  }
}
