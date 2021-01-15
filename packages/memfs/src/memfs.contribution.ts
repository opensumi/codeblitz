import { Autowired } from '@ali/common-di';
import { Domain, OnEvent, WithEventBus, BasicEvent } from '@ali/ide-core-common';
import { FileFlag } from 'browserfs/dist/node/core/file_flag';
import {
  LaunchContribution,
  IServerApp,
  RuntimeConfig,
  WORKSPACE_ROOT,
  BrowserFS,
} from '@alipay/alex-core';
import { EditorDocumentModelSavedEvent } from '@ali/ide-editor/lib/browser';
import { IFileServiceClient } from '@ali/ide-file-service/lib/common';
import * as path from 'path';
import { walkFileIndex } from './util';
import { AppConfig } from '@alipay/alex-core';

export class FileChangeEvent extends BasicEvent<{
  filepath: string;
  content: string;
}> {}

@Domain(LaunchContribution)
export class MemFSContribution extends WithEventBus implements LaunchContribution {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(IFileServiceClient)
  fileService: IFileServiceClient;

  async launch({ rootFS }: IServerApp) {
    const workspaceDir = path.join(WORKSPACE_ROOT, this.appConfig.workspaceDir || '');
    this.appConfig.workspaceDir = workspaceDir;
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
    const filepath = path.relative(this.appConfig.workspaceDir, uri.codeUri.fsPath);
    this.eventBus.fire(new FileChangeEvent({ filepath, content }));
  }
}
