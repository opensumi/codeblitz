import { ICodeEditorService } from '@opensumi/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService';
import { StandaloneKeybindingService } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { StandaloneServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
import { ICommandService } from '@opensumi/monaco-editor-core/esm/vs/platform/commands/common/commands';
import { IContextKeyService as IMonacoContextKeyService } from '@opensumi/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey';
import { ILogService } from '@opensumi/monaco-editor-core/esm/vs/platform/log/common/log';
import { INotificationService } from '@opensumi/monaco-editor-core/esm/vs/platform/notification/common/notification';
import { ITelemetryService } from '@opensumi/monaco-editor-core/esm/vs/platform/telemetry/common/telemetry';

export class StandaloneKeybindingServiceProxy extends StandaloneKeybindingService {
  // TODO contextService
  constructor(
    contextkeyService: IMonacoContextKeyService,
    monacoCodeService: ICodeEditorService,
    monacoCommandService: ICommandService,
  ) {
    super(
      contextkeyService,
      // StandaloneServices.get(IContextKeyService),
      monacoCommandService,
      // StandaloneServices.get(ICommandService),
      StandaloneServices.get(ITelemetryService),
      StandaloneServices.get(INotificationService),
      StandaloneServices.get(ILogService),
      // StandaloneServices.get(ICodeEditorService)
      monacoCodeService,
    );
  }
}
