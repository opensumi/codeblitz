import { Autowired, Injector, INJECTOR_TOKEN } from '@ali/common-di';
import { Domain, OnEvent, WithEventBus, BasicEvent, URI, Uri } from '@ali/ide-core-common';
import { AppConfig as ClientAppConfig } from '@ali/ide-core-browser';
import { FileFlag } from 'browserfs/dist/node/core/file_flag';
import {
  ServerAppContribution,
  IServerApp,
  RuntimeConfig,
  WORKSPACE_ROOT,
  BrowserFS,
  FileIndex,
} from '@alipay/spacex-core';
import { EditorDocumentModelSavedEvent } from '@ali/ide-editor/lib/browser';
import { IFileServiceClient } from '@ali/ide-file-service/lib/common';
import * as path from 'path';
import { walkFileIndex } from './util';
import { ServerAppConfig } from '@alipay/spacex-core';

export class FileChangeEvent extends BasicEvent<{
  filepath: string;
  content: string;
}> {}

@Domain(ServerAppContribution)
export class MemFSContribution extends WithEventBus implements ServerAppContribution {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  @Autowired(IFileServiceClient)
  fileService: IFileServiceClient;

  async launch({ rootFS }: IServerApp) {
    const { injector } = this;
    const clientAppConfig: ClientAppConfig = injector.get(ClientAppConfig);
    const serverAppConfig: ServerAppConfig = injector.get(ServerAppConfig);
    const workspaceDir = path.join(WORKSPACE_ROOT, clientAppConfig.workspaceDir || '');
    clientAppConfig.workspaceDir = workspaceDir;
    serverAppConfig.workspaceDir = workspaceDir;
    const memfs = await BrowserFS.createFileSystem(BrowserFS.FileSystem.InMemory, {});
    rootFS.mount(workspaceDir, memfs);
    const fileIndex = this.runtimeConfig?.memfs?.fileIndex;
    if (fileIndex) {
      const mode = 0x1ff; // 0x777
      const encoding = 'utf8';
      const flag = FileFlag.getFileFlag('w');
      if (!memfs.existsSync('/')) {
        memfs.mkdirSync('/', mode);
      }
      walkFileIndex(fileIndex, ({ type, path, content }) => {
        if (type === 'file') {
          memfs.writeFileSync(path, content, encoding, flag, mode);
        } else if (type === 'dir') {
          memfs.mkdirSync(path, mode);
        }
      });
    }
  }

  @OnEvent(EditorDocumentModelSavedEvent)
  async onEditorDocumentModelSavingEvent(e: EditorDocumentModelSavedEvent) {
    const uri = e.payload;
    const { content } = await this.fileService.resolveContent(uri.toString(true));
    const filepath = path.relative(
      this.injector.get(ClientAppConfig).workspaceDir,
      uri.codeUri.fsPath
    );
    this.eventBus.fire(new FileChangeEvent({ filepath, content }));
  }
}
