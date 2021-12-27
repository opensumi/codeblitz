import { Autowired } from '@ali/common-di';
import { Deferred, Disposable, Domain, URI, Uri } from '@ali/ide-core-common';
import { ClientAppContribution, PreferenceService, PreferenceChange } from '@ali/ide-core-browser';
import * as vscode from 'vscode';
import { IWorkspaceService } from '@ali/ide-workspace';
import { Position, Range, Location } from '@ali/ide-kaitian-extension/lib/common/vscode/ext-types';

import { LSIF_PROD_API_HOST, LSIF_TEST_API_HOST, LsifClient } from '@alipay/lsif-client';

import { SimpleLanguageService } from './simple';
import { IAntcodeService } from '../antcode-service/base';
import { WorkspaceManagerService } from '../workspace/workspace-loader.service';
import { reportLsifBehavior } from '../../utils/monitor';
import { toGitUri } from '../merge-request/changes-tree/util';
import * as timer from '../../utils/timer';
import { IFileServiceClient } from '@ali/ide-file-service';

const IS_TEST_ENV =
  process.env.NODE_ENV === 'development' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

@Domain(ClientAppContribution)
export class LanguageServiceContribution extends Disposable implements ClientAppContribution {
  @Autowired(SimpleLanguageService)
  private readonly simpleLanguageService: SimpleLanguageService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired()
  private readonly workspaceManagerService: WorkspaceManagerService;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  @Autowired(IFileServiceClient)
  private fileServiceClient: IFileServiceClient;

  get workspaceUri() {
    return new URI(this.workspaceService.workspace!.uri);
  }

  get repoId() {
    return this.antcodeService.projectPath;
  }

  // 标记 lsif 开启的 flag
  private lsIfEnabled: boolean;

  private async getRefAndPath(uri: Uri) {
    return await this.workspaceManagerService.getParsedUriParams(new URI(uri));
  }

  private ready: Deferred<void> = new Deferred();
  private lsifClient: LsifClient;

  constructor() {
    super();
    this.lsIfEnabled = !!this.preferenceService.get('acr.lsifEnabled');
    this.addDispose(
      this.preferenceService.onPreferenceChanged((data: PreferenceChange) => {
        if (data.preferenceName === 'acr.lsifEnabled') {
          this.lsIfEnabled = data.newValue;
        }
      })
    );

    const apiHost = IS_TEST_ENV ? LSIF_TEST_API_HOST : LSIF_PROD_API_HOST;
    this.lsifClient = new LsifClient(apiHost, 'acr');
    this.ready.resolve();
  }

  async onDidStart() {
    this.addDispose(
      this.simpleLanguageService.registerHoverProvider(
        { pattern: '**/*.{js,jsx,ts,tsx,java}' },
        {
          provideHover: async (document: vscode.TextDocument, position: Position) => {
            if (!this.lsIfEnabled) {
              return;
            }

            const params = await this.getRefAndPath(document.uri);
            if (!params) {
              return;
            }

            const { ref, path } = params;
            const payload = {
              repository: this.repoId,
              commit: ref,
              path,
              position: {
                line: position.line,
                character: position.character,
              },
            };

            const counter = timer.start();
            const response = await this.lsifClient.hover(payload);
            const duration = counter.end();
            const meta = {
              projectId: payload.repository,
              prId: this.antcodeService.pullRequest?.iid,
              commitId: payload.commit,
              path: payload.path,
            };

            if (response?.contents) {
              reportLsifBehavior('hover', true, duration, meta);
              return { contents: response.contents };
            }
            // 上报数据
            reportLsifBehavior('hover', false, duration, meta);
            return { contents: [] };
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

            const params = await this.getRefAndPath(document.uri);
            if (!params) {
              return;
            }
            const { ref, path } = params;
            const payload = {
              repository: this.repoId,
              commit: ref,
              path,
              position: {
                line: position.line,
                character: position.character,
              },
            };

            const counter = timer.start();
            const response = await this.lsifClient.reference(payload);
            const duration = counter.end();
            const meta = {
              projectId: payload.repository,
              prId: this.antcodeService.pullRequest?.iid,
              commitId: payload.commit,
              path: payload.path,
            };

            if (Array.isArray(response) && response.length) {
              // locations
              reportLsifBehavior('definition', true, duration, meta);
              return response.map((e: any) => {
                const locationUri = this.getLocationURI(e.uri, payload.commit);
                // const range = e.range as Range;
                const start: Position = new Position(e.range.start.line, e.range.start.character);
                const end: Position = new Position(e.range.end.line, e.range.end.character);
                const range: Range = new Range(start, end);
                const location = new Location(locationUri, range);
                return location;
              });
            }

            reportLsifBehavior('definition', false, duration, meta);
            return [];
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

            const params = await this.getRefAndPath(document.uri);
            if (!params) {
              return;
            }
            const { ref, path } = params;
            const payload = {
              repository: this.repoId,
              commit: ref,
              path,
              position: {
                line: position.line,
                character: position.character,
              },
            };

            const counter = timer.start();
            const response = await this.lsifClient.definition(payload);
            const duration = counter.end();
            const meta = {
              projectId: payload.repository,
              prId: this.antcodeService.pullRequest?.iid,
              commitId: payload.commit,
              path: payload.path,
            };

            if (Array.isArray(response) && response.length) {
              reportLsifBehavior('references', true, duration, meta);
              // locations
              return response.map((e: any) => {
                const locationUri = this.getLocationURI(e.uri, payload.commit);
                const start: Position = new Position(e.range.start.line, e.range.start.character);
                const end: Position = new Position(e.range.end.line, e.range.end.character);
                const range: Range = new Range(start, end);
                const location = new Location(locationUri, range);
                return location;
              });
            }

            reportLsifBehavior('references', false, duration, meta);
            return [];
          },
        }
      )
    );
  }

  private getLocationURI(uri: Uri, ref: string): Uri {
    const localURI = new URI(uri);
    const isPrChange = this.antcodeService.isPullRequestChange(localURI.path.toString());
    return toGitUri(
      localURI,
      ref,
      isPrChange ? localURI.path.toString() : '' // 增加 newPath 以支持编辑
    ).codeUri;
  }
}
