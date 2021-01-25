import { Autowired } from '@ali/common-di';
import { ClientAppContribution } from '@ali/ide-core-browser';
import { OnEvent, WithEventBus, BasicEvent, Domain } from '@ali/ide-core-common';
import { EditorDocumentModelSavedEvent } from '@ali/ide-editor/lib/browser';
import { IFileServiceClient } from '@ali/ide-file-service/lib/common';
import { AppConfig, RuntimeConfig } from '../../common/types';
import * as path from 'path';

export class FileChangeEvent extends BasicEvent<{
  filepath: string;
  content: string;
}> {}

@Domain(ClientAppContribution)
export class EditorActionEventContribution extends WithEventBus implements ClientAppContribution {
  @Autowired(IFileServiceClient)
  fileService: IFileServiceClient;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  onStart() {}

  @OnEvent(EditorDocumentModelSavedEvent)
  async onEditorDocumentModelSavingEvent(e: EditorDocumentModelSavedEvent) {
    if (this.runtimeConfig.workspace?.onDidSaveTextDocument) {
      const uri = e.payload;
      const { content } = await this.fileService.resolveContent(uri.toString(true));
      const filepath = path.relative(this.appConfig.workspaceDir, uri.codeUri.fsPath);
      this.runtimeConfig.workspace.onDidSaveTextDocument({ filepath, content });
    }
  }
}
