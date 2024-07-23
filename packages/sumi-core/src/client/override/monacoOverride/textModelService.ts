import * as monaco from '@opensumi/ide-monaco';
import {
  ITextModelContentProvider,
  ITextModelService,
} from '@opensumi/monaco-editor-core/esm/vs/editor/common/services/resolverService';

import { Injector } from '@opensumi/di';
import { MonacoTextModelService } from '@opensumi/ide-editor/lib/browser/doc-model/override';
export const IMonacoTextModelService = Symbol('IMonacoTextModelService');
export { MonacoTextModelService };

class MonacoTextModelServiceProxy implements ITextModelService {
  _serviceBrand: undefined;

  private injector: Injector | null = null;
  private uid = 0;

  setInjector(injector: Injector) {
    this.injector = injector;
    this.uid++;
    const currentUId = this.uid;
    return {
      dispose: () => {
        if (currentUId === this.uid && this.injector) {
          this.injector = null;
        }
      },
    };
  }

  canHandleResource(resource: any): boolean {
    return this.injector!.get(IMonacoTextModelService).canHandleResource(resource);
  }

  hasTextModelContentProvider(scheme: string): boolean {
    return this.injector!.get(IMonacoTextModelService).hasTextModelContentProvider(scheme);
  }

  async createModelReference(resource: monaco.Uri) {
    return this.injector!.get(IMonacoTextModelService).createModelReference(resource);
  }

  registerTextModelContentProvider(
    scheme: string,
    provider: ITextModelContentProvider,
  ): monaco.IDisposable {
    return this.injector!.get(IMonacoTextModelService).registerTextModelContentProvider(
      scheme,
      provider,
    );
  }
}

export const monacoTextModelServiceProxy = new MonacoTextModelServiceProxy();
