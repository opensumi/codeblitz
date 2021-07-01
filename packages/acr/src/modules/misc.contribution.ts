import { Autowired } from '@ali/common-di';
import {
  Domain,
  getIcon,
  Disposable,
  CommandRegistry,
  CommandContribution,
  localize,
  URI,
  IContextKey,
  IContextKeyService,
  ClientAppContribution,
  IEventBus,
  PreferenceContribution,
  EDITOR_COMMANDS,
  IPreferenceSettingsService,
  PreferenceScope,
  KeybindingContribution,
  KeybindingRegistry,
} from '@ali/ide-core-browser';
import {
  ILanguageService,
  IEditorDocumentModelService,
  EditorGroupChangeEvent,
} from '@ali/ide-editor/lib/browser';
import * as paths from '@ali/ide-core-common/lib/path';
import { TOGGLE_DIFF_SIDE_BY_SIDE } from '@ali/ide-scm';
import { QUICK_OPEN_COMMANDS } from '@ali/ide-quick-open';

import { IMenuRegistry, MenuId, MenuContribution } from '@ali/ide-core-browser/lib/menu/next';
import { fromDiffUri, fromGitUri } from './merge-request/changes-tree/util';
import { antCodePreferenceSchema } from './preferences';
import { WorkspaceManagerService } from './workspace/workspace-loader.service';
import { ILanguageGrammarRegistrationService } from './textmate-language-grammar/base';
import { IAntcodeService } from './antcode-service/base';
import { reportDiffEditorInlineMode } from '../utils/monitor';
import { ACR_IS_HIGHLIGHT, ACR_IS_FULLSCREEN } from '../constant';

class MiscCommands {
  static ExpandFie = {
    id: 'misc.expandFile',
  };

  static ToggleHighlight = {
    id: 'misc.toggleHighlight',
    iconClass: getIcon('alert'),
  };
}

const PLAIN_TEXT = 'plaintext';

@Domain(
  CommandContribution,
  MenuContribution,
  ClientAppContribution,
  PreferenceContribution,
  KeybindingContribution
)
export class MiscContribution
  extends Disposable
  implements
    CommandContribution,
    MenuContribution,
    ClientAppContribution,
    PreferenceContribution,
    KeybindingContribution {
  schema = antCodePreferenceSchema;

  @Autowired(IEditorDocumentModelService)
  private readonly editorDocumentModelService: IEditorDocumentModelService;

  @Autowired(ILanguageService)
  private readonly languageService: ILanguageService;

  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  @Autowired(IEventBus)
  private readonly eventBus: IEventBus;

  @Autowired()
  private readonly workspaceLoaderService: WorkspaceManagerService;

  @Autowired(ILanguageGrammarRegistrationService)
  private readonly languageGrammarService: ILanguageGrammarRegistrationService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(IPreferenceSettingsService)
  private readonly preferenceService: IPreferenceSettingsService;

  private readonly acrIsHighLight: IContextKey<boolean>;
  private readonly acrIsFullscreen: IContextKey<boolean>;

  constructor() {
    super();
    this.acrIsHighLight = ACR_IS_HIGHLIGHT.bind(this.globalContextKeyService);
    this.acrIsFullscreen = ACR_IS_FULLSCREEN.bind(this.globalContextKeyService);
  }

  onStart() {
    // 先取一次值
    this.acrIsFullscreen.set(this.antcodeService.isFullscreen);

    this.addDispose(
      this.antcodeService.onDidFullscreenChange((isFullscreen) => {
        this.acrIsFullscreen.set(isFullscreen);
      })
    );

    this.addDispose(
      // 编辑器切换时更新高亮的 contextkey
      this.eventBus.on(EditorGroupChangeEvent, (e) => {
        const { newResource } = e.payload;
        if (!newResource || !newResource.uri) {
          return;
        }

        const languageId = this.detectLanguageId(newResource.uri);
        // 如果资源是 PLAINTEXT 则意味着不是高亮 | 可忽略其是否本身就是 plaintext
        this.acrIsHighLight.set(languageId !== PLAIN_TEXT);
      })
    );

    this.workspaceLoaderService.init();

    this.registerLangByFilename();
    this.addDispose(
      this.antcodeService.onDidDiffsChange(() => {
        this.registerLangByFilename();
      })
    );

    /**
     * 由于 zone-widget 跟 renderSideBySide#false(inline 模式) 存在渲染冲突
     * 目前将历史的 `diffEditor.renderSideBySide` 修正掉
     * 并去掉 `diffEditor.renderSideBySide` 配置项入口
     */
    const currentRenderSideBySideOption = this.preferenceService.getPreference(
      'diffEditor.renderSideBySide',
      PreferenceScope.User
    );
    if (currentRenderSideBySideOption.value === false) {
      this.preferenceService.setPreference(
        'diffEditor.renderSideBySide',
        true,
        PreferenceScope.User
      );

      // 数据上报
      reportDiffEditorInlineMode({
        projectId: this.antcodeService.projectPath,
        prId: this.antcodeService.pullRequest?.iid,
      });
    }
  }

  private registerLangByFilename() {
    const changeFilenames = Array.prototype.concat.apply(
      [],
      this.antcodeService.pullRequestChangeList.map((diff) => [diff.oldPath, diff.newPath])
    );

    this.languageGrammarService.registerByFilenames(changeFilenames);
  }

  registerMenus(menus: IMenuRegistry): void {
    menus.registerMenuItem(MenuId.EditorTitle, {
      command: {
        id: MiscCommands.ToggleHighlight.id,
        label: localize('misc.toggleHighlight'),
      },
      iconClass: getIcon('alert'),
      group: 'navigation',
      when: 'resource =~ /newPath/',
      toggledWhen: 'acr.isHighlighted',
      order: 3,
    });

    // 由于 editor title 的定位问题，先把右键菜单禁用掉
    menus.unregisterMenuId(MenuId.EditorTitleContext);
  }

  registerCommands(commands: CommandRegistry): void {
    // commands.registerCommand(MiscCommands.ExpandFie, {
    //   execute: () => {
    //     // FIXME: 把代码折叠部分全部展开
    //   },
    // });

    commands.registerCommand(MiscCommands.ToggleHighlight, {
      execute: (_uri: URI) => {
        const uris: URI[] = [];
        if (_uri.scheme === 'diff') {
          const { left, right } = fromDiffUri(_uri);
          uris.push(left, right);
        } else {
          uris.push(_uri);
        }

        const languageId = this.detectLanguageId(_uri);
        if (languageId !== PLAIN_TEXT) {
          uris.forEach((uri: URI) => {
            this.editorDocumentModelService.changeModelOptions(uri, {
              languageId: PLAIN_TEXT,
            });
          });
          this.acrIsHighLight.set(false);
        } else {
          // 如果没命中高亮规则，则一直为 `未开启高亮状态`
          const targetLanguage = this.autoDetectLanguage(_uri);
          if (targetLanguage && targetLanguage.id) {
            uris.forEach((uri: URI) => {
              this.editorDocumentModelService.changeModelOptions(uri, {
                languageId: targetLanguage && targetLanguage.id,
              });
            });

            this.acrIsHighLight.set(true);
          }
        }
      },
    });

    // 不需要的 command 进行卸载
    [
      // 分屏相关
      EDITOR_COMMANDS.SPLIT_TO_LEFT,
      EDITOR_COMMANDS.SPLIT_TO_RIGHT,
      EDITOR_COMMANDS.SPLIT_TO_BOTTOM,
      EDITOR_COMMANDS.SPLIT_TO_TOP,
      // 切换 diff 时的内联视图
      TOGGLE_DIFF_SIDE_BY_SIDE,
      // 命令面板
      QUICK_OPEN_COMMANDS.OPEN,
    ].forEach((command) => {
      commands.unregisterCommand(command);
      commands.registerCommand(command);
    });

    /**
     * @deprecated
     */
    commands.registerCommand(
      {
        id: 'alex.codeServiceProject',
      },
      {
        execute: (uri: URI) => {
          // ACR 中通过 uri 拿到左/右对应的 commitId
          const { ref } = fromGitUri(uri);
          return {
            platform: 'antcode',
            project: this.antcodeService.projectPath,
            projectId: this.antcodeService.projectId,
            commit: ref,
            // FIXME: 将 rootUri / 收敛为 constants
            rootUri: {
              scheme: 'git',
              path: '/',
            },
          };
        },
      }
    );
  }

  // 通过右侧的 uri 去判断 currentLangId
  private detectLanguageId(uri: URI) {
    if (uri.scheme === 'diff') {
      const { right } = fromDiffUri(uri);
      uri = right;
    }

    const docRef = this.editorDocumentModelService.getModelReference(uri);
    const currentLangId = docRef && docRef.instance && docRef.instance.languageId;
    docRef && docRef.dispose();
    return currentLangId;
  }

  private autoDetectLanguage(uri: URI) {
    if (uri.scheme === 'diff') {
      const { right } = fromDiffUri(uri);
      uri = right;
    }

    const basename = paths.basename(uri.codeUri.fsPath);
    const extname = paths.extname(uri.codeUri.fsPath);
    // vscode 里面有一个 filenames/extensions 字段
    // https://github.com/microsoft/vscode/blob/master/src/vs/editor/common/services/languagesRegistry.ts#L155 逻辑
    return this.languageService.languages.find(
      (lang) => lang.filenames.has(basename) || lang.extensions.has(extname)
    );
  }

  registerKeybindings(keybindings: KeybindingRegistry) {
    keybindings.unregisterKeybinding('ctrlcmd+,');
  }
}
