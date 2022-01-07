import { Injectable, Autowired } from '@ali/common-di';
import { IDecorationsService } from '@ali/ide-decoration';
import {
  URI,
  Uri,
  FileDecorationsProvider,
  IFileDecoration,
  Emitter,
  DisposableCollection,
} from '@ali/ide-core-browser';
import { IThemeService } from '@ali/ide-theme';
import { ICommentsService } from '@ali/ide-comments';

import { THREAD_TYPE } from '../../../modules/comments';

@Injectable()
export class ChangesTreeDecorationService implements FileDecorationsProvider {
  @Autowired(IDecorationsService)
  private readonly decorationsService: IDecorationsService;

  @Autowired(IThemeService)
  public readonly themeService: IThemeService;

  private disposeCollection: DisposableCollection = new DisposableCollection();

  private readonly onDidChangeEmitter: Emitter<void> = new Emitter();

  private readonly _onDidChangeDecorationsEmitter: Emitter<Uri[]> = new Emitter();

  @Autowired(ICommentsService)
  private readonly commentsService: ICommentsService;

  constructor() {
    this.disposeCollection.pushAll([
      this.decorationsService.onDidChangeDecorations(() => {
        this.onDidChangeEmitter.fire();
      }),
      this.themeService.onThemeChange(() => {
        this.onDidChangeEmitter.fire();
      }),
      this.decorationsService.registerDecorationsProvider({
        label: 'change decotration',
        onDidChange: this._onDidChangeDecorationsEmitter.event,
        provideDecorations: (uri: Uri) => {
          const path = uri.path.startsWith('/') ? uri.path.slice(1) : uri.path;
          const threads = this.commentsService.commentsThreads.filter(
            (thread) =>
              thread.data?.type === THREAD_TYPE.COMMENT &&
              thread.uri.getParsedQuery().newPath === path
          );
          return {
            tooltip: threads.length + '',
          };
        },
      }),
    ]);
  }

  public triggerDecoration(uri: URI) {
    this._onDidChangeDecorationsEmitter.fire([uri.codeUri]);
  }

  get onDidChange() {
    return this.onDidChangeEmitter.event;
  }

  getDecoration(uri, hasChildren = false) {
    // 转换URI为vscode.uri
    if (uri instanceof URI) {
      uri = Uri.parse(uri.toString());
    }
    const decoration = this.decorationsService.getDecoration(uri, hasChildren);
    if (decoration) {
      return {
        ...decoration,
        // 通过ThemeService获取颜色值
        color: this.themeService.getColor({ id: decoration.color as string }),
      } as IFileDecoration;
    }
    return {
      color: '',
      tooltip: '',
      badge: '',
    } as IFileDecoration;
  }

  dispose() {
    this.disposeCollection.dispose();
  }
}
