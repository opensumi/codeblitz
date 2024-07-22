import { Injectable, Injector } from '@opensumi/di';
import * as monaco from '@opensumi/ide-monaco';
import { ResourceEdit } from '@opensumi/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService';
import type {
  IBulkEditOptions,
  IBulkEditPreviewHandler,
  IBulkEditResult,
  IBulkEditService,
} from '@opensumi/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService';
import { WorkspaceEdit } from '@opensumi/monaco-editor-core/esm/vs/editor/common/languages';

import { MonacoBulkEditService } from '@opensumi/ide-workspace-edit/lib/browser//bulk-edit.service';
export { MonacoBulkEditService };
export const IMonacoBulkEditServiceProxy = Symbol('IMonacoBulkEditServiceProxy');

class MonacoBulkEditServiceProxy implements IBulkEditService {
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

  async apply(
    resourceEdits: ResourceEdit[] | WorkspaceEdit,
    options?: IBulkEditOptions,
  ): Promise<IBulkEditResult & { success: boolean }> {
    return this.injector!.get(IMonacoBulkEditServiceProxy).apply(resourceEdits, options);
  }

  hasPreviewHandler(): boolean {
    return this.injector!.get(IMonacoBulkEditServiceProxy).hasPreviewHandler();
  }

  setPreviewHandler(handler: IBulkEditPreviewHandler): monaco.IDisposable {
    return this.injector!.get(IMonacoBulkEditServiceProxy).setPreviewHandler(handler);
  }
}

export const monacoBulkEditServiceProxy = new MonacoBulkEditServiceProxy();
