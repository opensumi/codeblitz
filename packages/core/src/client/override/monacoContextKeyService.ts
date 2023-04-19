import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import {
  MonacoContribution,
  Domain,
  MonacoOverrideServiceRegistry,
} from '@opensumi/ide-core-browser';
import { StandaloneKeybindingServiceProxy } from './monacoOverride/standaloneKeybindingService';

import { ICommandServiceToken } from '@opensumi/ide-monaco/lib/browser/contrib/command';
import { MonacoCodeService } from './monacoOverride/codeEditorService';
import { MonacoCommandService } from '@opensumi/ide-editor/lib/browser/monaco-contrib/command/command.service';
// import { MonacoCodeService, monacoCodeServiceProxy } from './codeEditorService';

export const IMonacoOverrideService = Symbol('IMonacoOverrideService');
@Injectable()
@Domain(MonacoContribution)
export class MonacoOverrideService implements MonacoContribution {
  @Autowired(ICommandServiceToken)
  monacoCommandService: MonacoCommandService;

  @Autowired(MonacoCodeService)
  monacoCodeService: MonacoCodeService;

  registerOverrideService(registry: MonacoOverrideServiceRegistry) {
    // TODO opensumi ServiceNames
    registry.registerOverrideService(
      // @ts-ignore
      'keybindingService',
      new StandaloneKeybindingServiceProxy(this.monacoCodeService, this.monacoCommandService)
    );
  }
}
