import {
  getExtensionPath,
} from '@codeblitzjs/ide-sumi-core';
import { Autowired } from '@opensumi/di';
import {
  ClientAppContribution,
  Disposable,
  Domain,
  IClientApp,
  PreferenceProvider,
  PreferenceScope,
  URI,
} from '@opensumi/ide-core-browser';
import { GeneralSettingsId, MaybePromise } from '@opensumi/ide-core-common';
import { IThemeService } from '@opensumi/ide-theme';

import { IDETheme } from '../extension/metadata';

@Domain(ClientAppContribution)
export class DefaultThemeGuardContribution extends Disposable implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  @Autowired(PreferenceProvider, { tag: PreferenceScope.Default })
  protected readonly defaultPreferenceProvider: PreferenceProvider;

  async initialize() {
    this.themeService.registerThemes(
      IDETheme.packageJSON.contributes!.themes,
      URI.parse(getExtensionPath(IDETheme.extension, 'public')),
    );
  }

  async onStart(app: IClientApp): Promise<void> {
          // 强制用集成设置的默认主题
    await this.themeService.applyTheme(
      this.defaultPreferenceProvider.get(GeneralSettingsId.Theme) as string,
    );
  }
}
