import { isFilesystemReady, WORKSPACE_ROOT } from '@codeblitzjs/ide-sumi-core';
import { InlineChatHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat.handler';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';
import {
  AppConfig,
  BrowserModule,
  ClientAppContribution,
  EDITOR_COMMANDS,
  IClientApp,
} from '@opensumi/ide-core-browser';
import {
  CommandContribution,
  Disposable,
  DisposableStore,
  Domain,
  Emitter,
  Event,
  IChatProgress,
  IDisposable,
  ILogger,
  URI,
} from '@opensumi/ide-core-common';
import { EditorCollectionService, IResourceOpenOptions, WorkbenchEditorService } from '@opensumi/ide-editor';
import { ICodeEditor, Selection, SelectionDirection } from '@opensumi/ide-monaco';

import { InlineChatController } from '@opensumi/ide-ai-native/lib/browser/widget/inline-chat/inline-chat-controller';
import { LiveInlineDiffPreviewer } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff-previewer';
import { InlineDiffHandler } from '@opensumi/ide-ai-native/lib/browser/widget/inline-diff/inline-diff.handler';
import { EResultKind } from '@opensumi/ide-ai-native/lib/common';
import { BrowserEditorContribution, IEditor, IEditorFeatureRegistry } from '@opensumi/ide-editor/lib/browser';
import { SumiReadableStream } from '@opensumi/ide-utils/lib/stream';
import { requireModule } from '../../api/require';
import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '../../modules/opensumi__common-di';
import { IMenuRegistry, MenuContribution } from '../../modules/opensumi__ide-core-browser';
import { ApplyDefaultThemeContribution } from '../theme';
import { IDiffViewerProps, IExtendPartialEditEvent } from './common';
import { removeStart } from './utils';

const fse = requireModule('fs-extra');
const path = requireModule('path');

@Domain(CommandContribution, ClientAppContribution, MenuContribution)
export class DiffViewerContribution
  implements CommandContribution, ClientAppContribution, MenuContribution
{
  private _disposables = new DisposableStore();

  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(InlineChatHandler)
  protected inlineChatHandler: InlineChatHandler;

  @Autowired(InlineDiffHandler)
  protected inlineDiffHandler: InlineDiffHandler;

  @Autowired(EditorCollectionService)
  private readonly editorCollectionService: EditorCollectionService;

  @Autowired(AppConfig)
  protected appConfig: AppConfig;

  @Autowired(ILogger)
  protected logger: ILogger;

  private readonly _onPartialEditEvent = this._disposables.add(new Emitter<IExtendPartialEditEvent>());
  public readonly onPartialEditEvent: Event<IExtendPartialEditEvent> = this._onPartialEditEvent.event;

  getFullPath(filePath: string) {
    return path.join(this.appConfig.workspaceDir, filePath);
  }

  stripDirectory(filePath: string) {
    const result = removeStart(filePath, this.appConfig.workspaceDir);
    if (result.startsWith('/')) {
      return result.slice(1);
    }
    return result;
  }

  async initialize(app: IClientApp): Promise<void> {
    await isFilesystemReady();

    let previewer: LiveInlineDiffPreviewer;
    const disposable = new Disposable();

    const openFileInTab = async (filePath: string, content: string, options?: IResourceOpenOptions) => {
      const fullPath = this.getFullPath(filePath);
      if (!await fse.pathExists(fullPath)) {
        await fse.ensureFile(fullPath);
        await fse.writeFile(fullPath, content);
      }

      const uri = URI.file(fullPath);
      await this.workbenchEditorService.open(uri, options);
      return uri;
    };


    this.inlineDiffHandler.onPartialEditEvent((e) => {
      const fsPath = e.uri.fsPath;

      this._onPartialEditEvent.fire({
        filePath: this.stripDirectory(fsPath),
        ...e,
      });
    })

    this.diffViewerProps.onRef({
      openDiffInTab: async (filePath, oldContent, newContent, options?: IResourceOpenOptions) => {
        const uri = await openFileInTab(filePath, oldContent, {
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

        previewer = this.inlineDiffHandler.showPreviewerByStream(monacoEditor, {
          crossSelection: Selection.fromRange(fullRange, SelectionDirection.LTR),
          chatResponse: controller,
        }) as LiveInlineDiffPreviewer;

        stream.emitData({
          kind: 'content',
          content: newContent,
        });
        stream.end();
      },
      openFileInTab,
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
      dispose: () => {
        disposable.dispose();
      },
    });
  }
  registerCommands() {
  }
  registerMenus(registry: IMenuRegistry) {
    registry.unregisterMenuItem('editor/title', EDITOR_COMMANDS.SPLIT_TO_RIGHT.id);
    registry.unregisterMenuItem('editor/title', EDITOR_COMMANDS.CLOSE_ALL_IN_GROUP.id);
  }
  dispose() {
    this._disposables.dispose();
  }
}

@Injectable()
export class DiffViewerModule extends BrowserModule {
  providers = [
    DiffViewerContribution,
    ApplyDefaultThemeContribution,
  ];
}
