import { ClientAppContribution, PreferenceProvider } from '@opensumi/ide-core-browser';
import { Disposable, Domain, PreferenceScope } from '@opensumi/ide-core-common';
import { IThemeService } from '@opensumi/ide-theme';
import { Autowired } from '../modules/opensumi__common-di';

@Domain(ClientAppContribution)
export class ApplyDefaultThemeContribution extends Disposable implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  @Autowired(PreferenceProvider, { tag: PreferenceScope.Default })
  protected readonly defaultPreferenceProvider: PreferenceProvider;

  async initialize() {
    // 强制用集成设置的默认主题
    await this.themeService.applyTheme(
      this.defaultPreferenceProvider.get('general.theme') as string,
    );
  }
}
