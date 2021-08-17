import { Autowired } from '@ali/common-di';
import { ClientAppContribution } from '@ali/ide-core-browser';
import { OnEvent, WithEventBus, BasicEvent, Domain, URI } from '@ali/ide-core-common';
import {
  EditorDocumentModelSavedEvent,
  EditorDocumentModelContentChangedEvent,
  IEditorDocumentModelService,
} from '@ali/ide-editor/lib/browser';
import { IFileServiceClient, FileChangeType } from '@ali/ide-file-service/lib/common';
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

  @Autowired(IEditorDocumentModelService)
  docModelService: IEditorDocumentModelService;

  onStart() {}

  initialize() {
    type EventType = { uri: string; filepath: string };

    this.addDispose(
      this.fileService.onFilesChanged((changes) => {
        const created: EventType[] = [];
        const changed: EventType[] = [];
        const deleted: EventType[] = [];

        for (const change of changes) {
          const relativePath = this.getWorkspaceRelativePath(new URI(change.uri));
          if (relativePath === null) {
            continue;
          }
          const obj: EventType = { uri: change.uri, filepath: relativePath };
          switch (change.type) {
            case FileChangeType.ADDED:
              created.push(obj);
              break;
            case FileChangeType.UPDATED:
              changed.push(obj);
              break;
            case FileChangeType.DELETED:
              deleted.push(obj);
              break;
            default:
              break;
          }
        }

        const { workspace } = this.runtimeConfig;
        if (created.length && workspace?.onDidCreateFiles) {
          workspace.onDidCreateFiles(created.map((data) => data.filepath));
        }
        if (deleted.length && workspace?.onDidDeleteFiles) {
          workspace.onDidDeleteFiles(deleted.map((data) => data.filepath));
        }
        if (changed.length && workspace?.onDidChangeFiles) {
          const { onDidChangeFiles } = workspace;
          // TODO: 直接返回 buffer? 编码假定为 utf8 了
          Promise.all(
            changed.map(async ({ uri, filepath }) => {
              const { content } = await this.fileService.resolveContent(uri);
              return {
                filepath,
                content,
              };
            })
          )
            .then((data) => {
              onDidChangeFiles(data);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
    );
  }

  @OnEvent(EditorDocumentModelSavedEvent)
  async onEditorDocumentModelSavingEvent(e: EditorDocumentModelSavedEvent) {
    if (this.runtimeConfig.workspace?.onDidSaveTextDocument) {
      const uri = e.payload;
      if (uri.scheme !== 'file') {
        return;
      }
      const { content } = await this.fileService.resolveContent(uri.toString(true));
      const filepath = this.getWorkspaceRelativePath(uri);
      if (filepath === null) {
        return;
      }
      this.runtimeConfig.workspace.onDidSaveTextDocument({ filepath, content });
    }
  }

  @OnEvent(EditorDocumentModelContentChangedEvent)
  async onEditorDocumentModelContentChangedEvent(e: EditorDocumentModelContentChangedEvent) {
    if (this.runtimeConfig.workspace?.onDidChangeTextDocument) {
      const { uri } = e.payload;
      if (uri.scheme !== 'file') {
        return;
      }
      const model = this.docModelService.getModelReference(uri);
      if (model) {
        const filepath = this.getWorkspaceRelativePath(uri);
        if (filepath === null) {
          return;
        }
        this.runtimeConfig.workspace.onDidChangeTextDocument({
          filepath,
          content: model.instance.getText(),
        });
        model.dispose();
      }
    }
  }

  getWorkspaceRelativePath(uri: URI): string | null {
    const absolutePath = uri.codeUri.path;
    const { workspaceDir } = this.appConfig;
    if (!absolutePath.startsWith(workspaceDir)) {
      return null;
    }
    return path.relative(this.appConfig.workspaceDir, absolutePath);
  }
}
