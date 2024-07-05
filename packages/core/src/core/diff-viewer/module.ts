import { isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { InlineChatHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat.handler';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';
import { AppConfig, BrowserModule, ClientAppContribution, IClientApp } from '@opensumi/ide-core-browser';
import { CommandContribution, Domain, Event, IChatProgress, ReplyResponse, URI, sleep } from '@opensumi/ide-core-common';
import { EditorCollectionService, IResourceOpenOptions, WorkbenchEditorService } from '@opensumi/ide-editor';
import { Selection, SelectionDirection } from '@opensumi/ide-monaco';
import { addElement } from '@opensumi/ide-utils/lib/arrays';
import { requireModule } from '../../api/require';
import { Autowired, Injectable } from '../../modules/opensumi__common-di';
import { IDiffViewerProps } from './common';
import { DiffViewerService } from './diff-viewer-service';
import { SumiReadableStream } from '@opensumi/ide-utils/lib/stream'
import { InlineChatController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat-controller';

const fse = requireModule('fs-extra');
const path = requireModule('path');

@Domain(CommandContribution, ClientAppContribution)
export class DiffViewerContribution implements CommandContribution, ClientAppContribution {
  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(DiffViewerService)
  protected diffViewerService: DiffViewerService;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(InlineChatHandler)
  protected inlineChatHandler: InlineChatHandler;

  @Autowired(EditorCollectionService)
  private readonly editorCollectionService: EditorCollectionService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  async initialize(app: IClientApp): Promise<void> {
    await isFilesystemReady();

    const callbacks = [] as ((e: IPartialEditEvent) => void)[];

    this.diffViewerProps.onRef({
      openDiffInTab: async (filePath, oldContent, newContent, options?: IResourceOpenOptions) => {
        const fullPath = this.getFullPath(filePath);
        if (!await fse.pathExists(fullPath)) {
          await fse.writeFile(fullPath, oldContent);
        }

        const uri = URI.file(fullPath);
        await this.workbenchEditorService.open(uri, {
          ...options,
          preview: false,
        });

        await sleep(200);

        const editor = this.editorCollectionService.listEditors().find((editor) =>
          editor.currentUri?.toString() === uri.toString()
        )!;

        const monacoEditor = editor.monacoEditor;
        const fullRange = monacoEditor.getModel()!.getFullModelRange();
        try {
          this.inlineChatHandler.discardAllPartialEdits();
        } catch (error) {
        }
        monacoEditor.setValue(oldContent);
        // monacoEditor.setSelection(fullRange);
        // await (this.inlineChatHandler as any).showInlineChat(editor);

        const stream = new SumiReadableStream<IChatProgress>()
        const controller = new InlineChatController()
        controller.mountReadable(stream);

        this.inlineChatHandler.visibleDiffWidget(editor.monacoEditor, {
          crossSelection: Selection.fromRange(fullRange, SelectionDirection.LTR),
          chatResponse: controller,
          // chatResponse: new ReplyResponse(newContent),
        }, {
          isRetry: false,
          relationId: '-1',
          startTime: 0,
        });

        stream.emitData({
          kind: 'content',
          content: newContent,
        });

        stream.end()

      },
      closeFile: async (filePath) => {
        await this.workbenchEditorService.close(URI.file(this.getFullPath(filePath)), false);
      },
      onPartialEditEvent: (cb) => {
        return addElement(callbacks, cb);
      },
      getFileContent: async (filePath: string) => {
        const fullPath = this.getFullPath(filePath);
        return await fse.readFile(fullPath, 'utf-8');
      },
      acceptAllPartialEdit: async () => {
        this.inlineChatHandler.acceptAllPartialEdits();
      },
      rejectAllPartialEdit: async () => {
        this.inlineChatHandler.discardAllPartialEdits();
      },
    });
  }
  registerCommands() {
  }
}

@Injectable()
export class DiffViewerModule extends BrowserModule {
  providers = [
    DiffViewerContribution,
  ];
}
