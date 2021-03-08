import { Autowired } from '@ali/common-di';
import {
  Command,
  CommandRegistry,
  CommandService,
  Disposable,
  Domain,
  URI,
  Uri,
} from '@ali/ide-core-common';
import { ClientAppContribution, PreferenceService, PreferenceChange } from '@ali/ide-core-browser';
import { Position, Range, Location } from '@ali/ide-kaitian-extension/lib/common/vscode/ext-types';
import { IWorkspaceService } from '@ali/ide-workspace';
import * as paths from '@ali/ide-core-common/lib/path';

import * as vscode from 'vscode';
import { LSIF_PROD_API_HOST, LSIF_TEST_API_HOST, LsifClient } from '@alipay/lsif-client';
import { RuntimeConfig } from '@alipay/alex-core';

import { SimpleLanguageService } from './language-client';

const IS_TEST_ENV =
  process.env.NODE_ENV === 'development' ||
  window.location.pathname.indexOf('test') > -1 ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

@Domain(ClientAppContribution)
export class LsifContribution extends Disposable implements ClientAppContribution {
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

  private async getCodeServiceProject() {
    return await this.commands.executeCommand('alex.codeServiceProject');
  }

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

  constructor() {
    super();

    this.lsifClient = new LsifClient(IS_TEST_ENV ? LSIF_TEST_API_HOST : LSIF_PROD_API_HOST);
    // 集成侧如果需要不一样的 preference name 则需要进行代理
    this.lsIfEnabled = true; // !!this.preferenceService.get<boolean>('lsif.enable');
    this.lsifDocumentScheme = 'file'; // this.preferenceService.get<string>('lsif.documentScheme') || 'git';
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

            const rootUri = await this.getWorkspaceRoot();
            if (!rootUri) {
              return;
            }

            const { commit, project } = (await this.getCodeServiceProject()) as any;

            return await this.lsifClient.hover({
              repository: project,
              commit,
              path: rootUri.relative(new URI(document.uri))!.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            });
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

            const rootUri = await this.getWorkspaceRoot();
            if (!rootUri) {
              return;
            }

            const { commit, project } = (await this.getCodeServiceProject()) as any;

            const ret = await this.lsifClient.reference({
              repository: project,
              commit,
              path: rootUri.relative(new URI(document.uri))!.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            });

            if (!ret) {
              return;
            }

            return ret.map((locationDesc) => {
              const path = paths.resolve(
                rootUri.path.toString(),
                new URI(locationDesc.uri).path.toString()
              );
              const locationUri = URI.file(path).codeUri;
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
            });
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

            const rootUri = await this.getWorkspaceRoot();
            if (!rootUri) {
              return;
            }

            const { commit, project } = (await this.getCodeServiceProject()) as any;

            const ret = await this.lsifClient.definition({
              repository: project,
              commit,
              path: rootUri.relative(new URI(document.uri))!.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            });

            if (!ret) {
              return;
            }

            return ret.map((locationDesc) => {
              const path = paths.resolve(
                rootUri.path.toString(),
                new URI(locationDesc.uri).path.toString()
              );
              const locationUri = URI.file(path).codeUri;

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
            });
          },
        }
      )
    );
  }
}
