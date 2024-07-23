import { ClientAppContribution, PreferenceProvider } from '@opensumi/ide-core-browser';
import { Disposable, Domain, GeneralSettingsId, PreferenceScope } from '@opensumi/ide-core-common';
import { IThemeService } from '@opensumi/ide-theme';
import { Autowired } from '../modules/opensumi__common-di';

@Domain(ClientAppContribution)
export class ApplyDefaultThemeContribution extends Disposable implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  @Autowired(PreferenceProvider, { tag: PreferenceScope.Default })
  protected readonly defaultPreferenceProvider: PreferenceProvider;

  async onDidStart() {
    // 强制用集成设置的默认主题
    await this.themeService.applyTheme(
      this.defaultPreferenceProvider.get(GeneralSettingsId.Theme) as string,
    );
  }
}
