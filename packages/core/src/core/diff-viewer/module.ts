import { isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { InlineChatHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat.handler';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';
import { AppConfig, BrowserModule, ClientAppContribution, IClientApp } from '@opensumi/ide-core-browser';
import {
  CommandContribution,
  DisposableStore,
  Domain,
  Emitter,
  Event,
  IChatProgress,
  ILogger,
  URI,
} from '@opensumi/ide-core-common';
import { EditorCollectionService, IResourceOpenOptions, WorkbenchEditorService } from '@opensumi/ide-editor';
import { Selection, SelectionDirection } from '@opensumi/ide-monaco';

import { InlineChatController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat-controller';
import { LiveInlineDiffPreviewer } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff-previewer';
import { InlineDiffService } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff.service';
import { EResultKind } from '@opensumi/ide-ai-native/lib/common';
import { SumiReadableStream } from '@opensumi/ide-utils/lib/stream';
import { requireModule } from '../../api/require';
import { Autowired, Injectable } from '../../modules/opensumi__common-di';
import { ApplyDefaultThemeContribution } from '../theme';
import { IDiffViewerProps } from './common';

const fse = requireModule('fs-extra');
const path = requireModule('path');

@Domain(CommandContribution, ClientAppContribution)
export class DiffViewerContribution implements CommandContribution, ClientAppContribution {
  private _disposables = new DisposableStore();

  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(InlineChatHandler)
  protected inlineChatHandler: InlineChatHandler;

  @Autowired(InlineDiffService)
  protected inlineDiffService: InlineDiffService;

  @Autowired(EditorCollectionService)
  private readonly editorCollectionService: EditorCollectionService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  @Autowired(ILogger)
  protected logger: ILogger;

  private readonly _onPartialEditEvent = this._disposables.add(new Emitter<IPartialEditEvent>());
  public readonly onPartialEditEvent: Event<IPartialEditEvent> = this._onPartialEditEvent.event;

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  async initialize(app: IClientApp): Promise<void> {
    await isFilesystemReady();

    let previewer: LiveInlineDiffPreviewer;

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

        const editor = this.editorCollectionService.getEditorByUri(
          uri,
        )!;

        if (previewer) {
          try {
            if (previewer) {
              previewer.handleAction(EResultKind.DISCARD);
            }
            previewer.dispose();
          } catch (error) {
            this.logger.log(`DiffViewerContribution ~ openDiffInTab: ~ error:`, error);
          }
        }

        const monacoEditor = editor.monacoEditor;
        monacoEditor.setValue(oldContent);

        const fullRange = monacoEditor.getModel()!.getFullModelRange();

        const stream = new SumiReadableStream<IChatProgress>();
        const controller = new InlineChatController();
        controller.mountReadable(stream);

        previewer = this.inlineDiffService.createDiffPreviewer(monacoEditor, {
          crossSelection: Selection.fromRange(fullRange, SelectionDirection.LTR),
          chatResponse: controller,
        }) as LiveInlineDiffPreviewer;

        previewer.addDispose(previewer.onPartialEditEvent((e) => {
          this._onPartialEditEvent.fire(e);
        }));

        stream.emitData({
          kind: 'content',
          content: newContent,
        });
        stream.end();
      },
      openTab: async (filePath: string, options?: IResourceOpenOptions) => {
        const fullPath = this.getFullPath(filePath);
        const uri = URI.file(fullPath);
        await this.workbenchEditorService.open(uri, {
          ...options,
        });
      },
      closeTab: async (filePath) => {
        await this.workbenchEditorService.close(URI.file(this.getFullPath(filePath)), false);
      },
      onPartialEditEvent: (cb) => {
        return this.onPartialEditEvent(cb);
      },
      getFileContent: async (filePath: string) => {
        const fullPath = this.getFullPath(filePath);
        return await fse.readFile(fullPath, 'utf-8');
      },
      acceptAllPartialEdit: async () => {
        if (previewer) {
          previewer.handleAction(EResultKind.ACCEPT);
        }
      },
      rejectAllPartialEdit: async () => {
        if (previewer) {
          previewer.handleAction(EResultKind.DISCARD);
        }
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
    ApplyDefaultThemeContribution,
  ];
}
