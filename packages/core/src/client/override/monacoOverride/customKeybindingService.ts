import { StandaloneKeybindingService } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { StandaloneServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { IContextKeyService } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey';
import { ICommandService } from '@opensumi/monaco-editor-core/esm/vs/platform/commands/common/commands';
import { ITelemetryService } from '@opensumi/monaco-editor-core/esm/vs/platform/telemetry/common/telemetry';
import { INotificationService } from '@opensumi/monaco-editor-core/esm/vs/platform/notification/common/notification';
import { ILogService } from '@opensumi/monaco-editor-core/esm/vs/platform/log/common/log';
import { ICodeEditorService } from '@opensumi/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService';

class CustomKeybindingService extends StandaloneKeybindingService {
  constructor() {
    const codeEditorService = StandaloneServices.get(ICodeEditorService);

    super(
      StandaloneServices.get(IContextKeyService),
      StandaloneServices.get(ICommandService),
      StandaloneServices.get(ITelemetryService),
      StandaloneServices.get(INotificationService),
      StandaloneServices.get(ILogService),
      StandaloneServices.get(ICodeEditorService)
    );

    codeEditorService.onCodeEditorAdd(() => {
      this['_domNodeListeners'].forEach((d) => {
        d.dispose();
      });
    });
  }
}

export const customKeybindingService = new CustomKeybindingService();
