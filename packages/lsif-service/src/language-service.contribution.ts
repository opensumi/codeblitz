import { Autowired } from '@ali/common-di';
import {
  CommandService,
  Disposable,
  Domain,
  URI,
  Uri,
  IReporterService,
  Emitter,
} from '@ali/ide-core-common';
import {
  ClientAppContribution,
  PreferenceService,
  PreferenceChange,
  PreferenceContribution,
  LabelService,
} from '@ali/ide-core-browser';
import { Position, Range, Location } from '@ali/ide-kaitian-extension/lib/common/vscode/ext-types';
import { IWorkspaceService } from '@ali/ide-workspace';
import * as paths from '@ali/ide-core-common/lib/path';
import { UriComponents } from 'vscode-uri';
import { EditorComponentRegistry, ResourceService, IResource } from '@ali/ide-editor/lib/browser';

import * as vscode from 'vscode';
import {
  LSIF_PROD_API_HOST,
  LSIF_TEST_API_HOST,
  LsifClient,
  OriginScheme,
} from '@alipay/lsif-client';
import { RuntimeConfig, REPORT_NAME } from '@alipay/alex-core';
import {
  BrowserEditorContribution,
  IEditorDocumentModelContentRegistry,
} from '@ali/ide-editor/lib/browser';

import { SimpleLanguageService } from './language-client';
import { LsifPreferences, lsifPreferenceSchema } from './lsif-preferences';

const IS_TEST_ENV =
  process.env.NODE_ENV === 'development' ||
  window.location.pathname.indexOf('test') > -1 ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const handleLsifScheme = (scheme: string) => {
  const supportScheme: string[] = [OriginScheme.Jar, OriginScheme.Tnpm];
  return supportScheme.includes(scheme) ? 10 : -1;
};

@Domain(ClientAppContribution, PreferenceContribution, BrowserEditorContribution)
export class LsifContribution
  extends Disposable
  implements ClientAppContribution, PreferenceContribution, BrowserEditorContribution {
  @Autowired(SimpleLanguageService)
  private readonly simpleLanguageService: SimpleLanguageService;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(RuntimeConfig)
  private readonly runtimeConfig: RuntimeConfig;

  @Autowired(CommandService)
  private readonly commands: CommandService;

  @Autowired(LsifPreferences)
  protected preferences: LsifPreferences;

  @Autowired()
  labelService: LabelService;

  @Autowired(IReporterService)
  reporterService: IReporterService;

  readonly schema = lsifPreferenceSchema;

  private async getCodeServiceProject(): Promise<
    | {
        project: string;
        commit: string;
        rootUri: UriComponents;
      }
    | undefined
  > {
    return await this.commands.executeCommand('alex.codeServiceProject');
  }

  // 环境
  private lsIfEnv: 'test' | 'prod';
  // 标记 lsif 开启的 flag
  private lsIfEnabled: boolean;
  // 支持 lsif 的 scheme
  private lsifDocumentScheme: string;
  // lsif 客户端
  private lsifClient: LsifClient;

  private async getWorkspaceRoot(): Promise<URI | undefined> {
    const [root] = await this.workspaceService.roots;
    return root ? new URI(root.uri) : undefined;
  }

  initialize() {
    this.lsIfEnv = this.preferences['lsif.env'];
    let apiHost = '';
    if (this.lsIfEnv) {
      apiHost = this.lsIfEnv === 'prod' ? LSIF_PROD_API_HOST : LSIF_TEST_API_HOST;
    } else {
      apiHost = IS_TEST_ENV ? LSIF_TEST_API_HOST : LSIF_PROD_API_HOST;
    }
    this.lsifClient = new LsifClient(apiHost, this.runtimeConfig.biz || window.location.hostname);
    // 集成侧如果需要不一样的 preference name 则需要进行代理
    this.lsIfEnabled = this.preferences['lsif.enable'];
    this.lsifDocumentScheme = this.preferences['lsif.documentScheme'];
    this.addDispose(
      this.preferenceService.onPreferenceChanged((data: PreferenceChange) => {
        if (data.preferenceName === 'lsif.enable') {
          this.lsIfEnabled = data.newValue;
        }

        if (data.preferenceName === 'lsif.documentScheme') {
          this.lsifDocumentScheme = data.newValue;
        }
      })
    );
  }

  private checkRepoInfo(uri: Uri) {
    return this.lsIfEnabled && uri.scheme === this.lsifDocumentScheme;
  }

  async onDidStart() {
    // lsif registration
    this.addDispose(
      this.simpleLanguageService.registerHoverProvider(
        { pattern: '**/*.{js,jsx,ts,tsx,java}' },
        {
          provideHover: async (document: vscode.TextDocument, position: Position) => {
            if (!this.checkRepoInfo(document.uri)) {
              return;
            }

            // 挂载规则不确定，因此无法直接使用 workspaceRoots
            // FIXME: 更好的方式
            const projectInfo = await this.getCodeServiceProject();
            if (!projectInfo) return;
            const { commit, project, rootUri } = projectInfo;
            const _rootUri = new URI(URI.revive(rootUri));
            const path = _rootUri.relative(new URI(document.uri));
            if (!path) return;

            const params = {
              repository: project,
              commit,
              path: path.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            };

            const ret = await this.lsifClient.hover(params);

            setTimeout(() => {
              this.reporterService.point(REPORT_NAME.LSIF_LANGUAGE_SERVICE, 'provideHover', {
                params,
                response: ret,
              });
            });

            return ret;
          },
        }
      )
    );

    this.addDispose(
      this.simpleLanguageService.registerReferenceProvider(
        { pattern: '**/*.{js,jsx,ts,tsx,java}' },
        {
          provideReferences: async (document: vscode.TextDocument, position: Position) => {
            if (!this.checkRepoInfo(document.uri)) {
              return;
            }

            const projectInfo = await this.getCodeServiceProject();
            if (!projectInfo) return;
            const { commit, project, rootUri } = projectInfo;
            const _rootUri = new URI(URI.revive(rootUri));
            const path = _rootUri.relative(new URI(document.uri));
            if (!path) return;

            const params = {
              repository: project,
              commit,
              path: path.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            };

            const ret = await this.lsifClient.reference(params);

            setTimeout(() => {
              this.reporterService.point(REPORT_NAME.LSIF_LANGUAGE_SERVICE, 'provideReferences', {
                params,
                response: ret,
              });
            });

            if (!ret) {
              return;
            }

            return ret
              .map((locationDesc) => {
                const { scheme, path } = Uri.parse(locationDesc.uri);

                let locationUri: Uri;

                switch (scheme) {
                  // 仓库内
                  case '':
                  case 'file':
                    locationUri = Uri.file(paths.posix.join(_rootUri.path.toString(), path));
                    break;

                  // 跨库
                  case OriginScheme.Jar:
                  case OriginScheme.Tnpm:
                    locationUri = Uri.from({
                      scheme,
                      path,
                    });
                    break;

                  // 无法处理的协议不处理
                  default:
                    return null;
                }

                const start: Position = new Position(
                  locationDesc.range.start.line,
                  locationDesc.range.start.character
                );
                const end: Position = new Position(
                  locationDesc.range.end.line,
                  locationDesc.range.end.character
                );
                const range: Range = new Range(start, end);
                const location = new Location(locationUri, range);
                return location;
              })
              .filter((v): v is Location => Boolean(v));
          },
        }
      )
    );

    this.addDispose(
      this.simpleLanguageService.registerDefinitionProvider(
        { pattern: '**/*.{js,jsx,ts,tsx,java}' },
        {
          provideDefinition: async (document: vscode.TextDocument, position: Position) => {
            if (!this.checkRepoInfo(document.uri)) {
              return;
            }

            const projectInfo = await this.getCodeServiceProject();
            if (!projectInfo) return;
            const { commit, project, rootUri } = projectInfo;
            const _rootUri = new URI(URI.revive(rootUri));
            const path = _rootUri.relative(new URI(document.uri));
            if (!path) return;

            const params = {
              repository: project,
              commit,
              path: path.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            };

            const ret = await this.lsifClient.definition(params);

            setTimeout(() => {
              this.reporterService.point(REPORT_NAME.LSIF_LANGUAGE_SERVICE, 'provideDefinition', {
                params,
                response: ret,
              });
            });

            if (!ret) {
              return;
            }

            return ret
              .map((locationDesc) => {
                const { scheme, path } = Uri.parse(locationDesc.uri);

                let locationUri: Uri;

                switch (scheme) {
                  // 仓库内
                  case '':
                  case 'file':
                    locationUri = Uri.file(paths.posix.join(_rootUri.path.toString(), path));
                    break;

                  // 跨库
                  case OriginScheme.Jar:
                  case OriginScheme.Tnpm:
                    locationUri = Uri.from({
                      scheme,
                      path,
                    });
                    break;

                  // 无法处理的协议不处理
                  default:
                    return null;
                }

                const start: Position = new Position(
                  locationDesc.range.start.line,
                  locationDesc.range.start.character
                );
                const end: Position = new Position(
                  locationDesc.range.end.line,
                  locationDesc.range.end.character
                );
                const range: Range = new Range(start, end);
                const location = new Location(locationUri, range);
                return location;
              })
              .filter((v): v is Location => Boolean(v));
          },
        }
      )
    );
  }

  registerResource(service: ResourceService) {
    service.registerResourceProvider({
      handlesUri: (uri) => handleLsifScheme(uri.scheme),
      provideResource: async (uri: URI): Promise<IResource> => {
        return Promise.all([this.labelService.getName(uri), this.labelService.getIcon(uri)]).then(
          ([name, icon]) => {
            return {
              name,
              icon,
              uri,
              metadata: null,
            };
          }
        );
      },
    });
  }

  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorComponentResolver(handleLsifScheme, (_resource, results) => {
      results.push({
        type: 'code',
        readonly: true,
      });
    });
  }

  registerEditorDocumentModelContentProvider(registry: IEditorDocumentModelContentRegistry) {
    registry.registerEditorDocumentModelContentProvider({
      onDidChangeContent: new Emitter<URI>().event,
      handlesScheme: (scheme) => handleLsifScheme(scheme) > 0,
      isReadonly: () => true,
      provideEditorDocumentModelContent: (uri: URI) =>
        this.lsifClient.getFileContentFromUriString(uri.toString()),
    });
  }
}
