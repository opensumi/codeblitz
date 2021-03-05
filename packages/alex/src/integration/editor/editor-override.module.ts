import { Provider, Injectable, Autowired } from '@ali/common-di';
import {
  BrowserModule,
  ClientAppContribution,
  URI,
  Domain,
  getPreferenceThemeId,
} from '@ali/ide-core-browser';
import { BreadCrumbServiceImpl } from '@ali/ide-editor/lib/browser/breadcrumb';
import { IBreadCrumbService } from '@ali/ide-editor/lib/browser/types';
import { IThemeService } from '@ali/ide-theme';
import { getExtensionPath } from '@alipay/alex-core';
import { IDETheme } from '../../core/extensions';

@Domain(ClientAppContribution)
class ThemeContribution implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  async initialize() {
    this.themeService.registerThemes(
      IDETheme.packageJSON.contributes!.themes,
      URI.parse(getExtensionPath(IDETheme.extension))
    );
    await this.themeService.applyTheme(getPreferenceThemeId());
  }
}

@Injectable()
class BreadCrumbServiceImplOverride extends BreadCrumbServiceImpl {
  getBreadCrumbs() {
    return undefined;
  }
}

@Injectable()
export class EditorOverrideModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: IBreadCrumbService,
      useClass: BreadCrumbServiceImplOverride,
      override: true,
    },
    ThemeContribution,
  ];
}
