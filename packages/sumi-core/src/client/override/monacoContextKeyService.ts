import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import {
  Domain,
  IContextKeyService,
  MonacoContribution,
  MonacoOverrideServiceRegistry,
} from '@opensumi/ide-core-browser';
import { StandaloneKeybindingServiceProxy } from './monacoOverride/standaloneKeybindingService';

import { MonacoCommandService } from '@opensumi/ide-editor/lib/browser/monaco-contrib/command/command.service';
import { ICommandServiceToken } from '@opensumi/ide-monaco/lib/browser/contrib/command';
import { MonacoCodeService } from './monacoOverride/codeEditorService';
// import { MonacoCodeService, monacoCodeServiceProxy } from './codeEditorService';

export const IMonacoOverrideService = Symbol('IMonacoOverrideService');

@Domain(MonacoContribution)
export class MonacoOverrideService implements MonacoContribution {
  @Autowired(ICommandServiceToken)
  private monacoCommandService: MonacoCommandService;

  @Autowired(MonacoCodeService)
  private monacoCodeService: MonacoCodeService;

  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  registerOverrideService(registry: MonacoOverrideServiceRegistry) {
    // TODO opensumi ServiceNames
    registry.registerOverrideService(
      // @ts-ignore
      'keybindingService',
      new StandaloneKeybindingServiceProxy(
        this.globalContextKeyService.contextKeyService,
        this.monacoCodeService,
        this.monacoCommandService,
      ),
    );
  }
}
