import { Autowired } from '@opensumi/di';
import { ClientAppContribution, PreferenceProvider } from '@opensumi/ide-core-browser';
import { Domain, GeneralSettingsId, PreferenceScope } from '@opensumi/ide-core-common';
import { ITheme, ThemeContributionProvider } from '@opensumi/ide-theme';
import { IThemeService } from '@opensumi/ide-theme';
import { IDiffViewerProps } from '../common';

@Domain(ThemeContributionProvider, ClientAppContribution)
export class DiffViewerThemeProvider implements ThemeContributionProvider, ClientAppContribution {
  @Autowired(IDiffViewerProps)
  protected diffViewerProps: IDiffViewerProps;

  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  @Autowired(PreferenceProvider, { tag: PreferenceScope.Default })
  protected readonly defaultPreferenceProvider: PreferenceProvider;

  async onStart() {
    // 强制用集成设置的默认主题
    await this.themeService.applyTheme(
      this.defaultPreferenceProvider.get(GeneralSettingsId.Theme) as string,
    );
  }

  onWillApplyTheme(theme: ITheme): Record<string, string | undefined> {
    const externalTheme = this.diffViewerProps?.onWillApplyTheme?.(theme) || {};

    return {
      'editorGroup.border': '#e0e0e0',
      'editorGroup.dropBackground': 'rgba(204, 204, 204, 0.25)',
      'editorGroup.dropIntoPromptBackground': '#f3f3f3',
      'editorGroup.dropIntoPromptBorder': '',
      'editorGroup.dropIntoPromptForeground': '#4d4d4d',
      'editorGroup.emptyBackground': '#ffffff',
      'editorGroup.focusedEmptyBorder': '',
      'editorGroupHeader.border': '',
      'editorGroupHeader.noTabsBackground': '#ffffff',
      'editorGroupHeader.tabsBackground': '#f2f2f2',
      'editorGroupHeader.tabsBorder': '',
      ...externalTheme,
    };
  }
}
