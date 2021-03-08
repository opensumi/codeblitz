import { Autowired } from '@ali/common-di';
import { Disposable, Domain, URI } from '@ali/ide-core-common';
import { ClientAppContribution, PreferenceService, PreferenceChange } from '@ali/ide-core-browser';
import * as vscode from 'vscode';
import { LSIF_PROD_API_HOST, LSIF_TEST_API_HOST, LsifClient } from '@alipay/lsif-client';
import { Position, Range, Location } from '@ali/ide-kaitian-extension/lib/common/vscode/ext-types';

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

  // 标记 lsif 开启的 flag
  private lsIfEnabled: boolean;
  // lsif 客户端
  private lsifClient: LsifClient;

  constructor() {
    super();

    this.lsifClient = new LsifClient(IS_TEST_ENV ? LSIF_TEST_API_HOST : LSIF_PROD_API_HOST);
    // 集成侧如果需要不一样的 preference name 则需要进行代理
    this.lsIfEnabled = !!this.preferenceService.get<boolean>('lsif.enable');
    this.addDispose(
      this.preferenceService.onPreferenceChanged((data: PreferenceChange) => {
        if (data.preferenceName === 'lsif.enable') {
          this.lsIfEnabled = data.newValue;
        }
      })
    );
  }

  private _repoPath: string;
  public get repository() {
    return this._repoPath;
  }
  public set repository(repo: string) {
    this._repoPath = repo;
  }

  private _ref: string;
  public get ref() {
    return this._ref;
  }
  public set ref(ref: string) {
    this._ref = ref;
  }

  async onDidStart() {
    // lsif registration
    this.addDispose(
      this.simpleLanguageService.registerHoverProvider(
        { pattern: '**/*.{js,jsx,ts,tsx,java}' },
        {
          provideHover: async (document: vscode.TextDocument, position: Position) => {
            if (!this.lsIfEnabled) {
              return;
            }

            return await this.lsifClient.hover({
              repository: this.repository,
              commit: this.ref,
              // FIXME: 需要一个转换规则 因为不知道 集成方 是如何定义 path/uri 的
              path: document.uri.path.toString(),
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
            if (!this.lsIfEnabled) {
              return;
            }

            const ret = await this.lsifClient.reference({
              repository: this.repository,
              commit: this.ref,
              // FIXME: 需要一个转换规则 因为不知道 集成方 是如何定义 path/uri 的
              path: document.uri.path.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            });

            if (!ret) {
              return;
            }

            return ret.map((locationDesc) => {
              // 返回的 uri 中没有 commitId
              // FIXME: 这里需要额外处理一下
              const locationUri = new URI(locationDesc.uri).codeUri;
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
            if (!this.lsIfEnabled) {
              return;
            }

            const ret = await this.lsifClient.definition({
              repository: this.repository,
              commit: this.ref,
              path: document.uri.path.toString(),
              position: {
                character: position.character,
                line: position.line,
              },
            });

            if (!ret) {
              return;
            }

            return ret.map((locationDesc) => {
              const locationUri = new URI(locationDesc.uri).codeUri;
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
