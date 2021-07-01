import { Injectable, Autowired } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import { ClientAppContribution, URI } from '@ali/ide-core-browser';
import { IIconService, IThemeService, ThemeContribution } from '@ali/ide-theme';

import { alipayGeekThemeExt } from '../../extensions/alipay-geek-theme';
import { vscIconThemeExt } from '../../extensions/vsc-icon-theme';
import { getMarketPlaceUrl } from '../../extensions/util';

@Injectable()
@Domain(ClientAppContribution)
export class ThemeAndIconContribution implements ClientAppContribution {
  @Autowired(IThemeService)
  private readonly themeService: IThemeService;

  @Autowired(IIconService)
  private readonly iconService: IIconService;

  async initialize() {
    this.themeService.registerThemes(
      alipayGeekThemeExt.pkgJSON.contributes.themes as ThemeContribution[],
      URI.parse(
        getMarketPlaceUrl(
          alipayGeekThemeExt.pkgJSON.publisher,
          alipayGeekThemeExt.pkgJSON.name,
          alipayGeekThemeExt.pkgJSON.version
        )
      )
    );

    this.iconService.registerIconThemes(
      vscIconThemeExt.pkgJSON.contributes.iconThemes,
      URI.parse(
        getMarketPlaceUrl(
          vscIconThemeExt.pkgJSON.publisher,
          vscIconThemeExt.pkgJSON.name,
          vscIconThemeExt.pkgJSON.version
        )
      )
    );

    await this.themeService.applyTheme(alipayGeekThemeExt.pkgJSON.contributes.themes[1].id);

    // workbench.colorCustomizations 配置没有重新更改 monaco 主题，因此通过这种方式更改主题
    // const currentTheme = this.themeService.getCurrentThemeSync();
    // Object.assign(currentTheme.themeData.colors, {
    //   // TODO: 下面的设置不生效，需要框架侧支持
    //   // 'editor.foreground': '#555',
    //   // 'scrollbarSlider.background': '#00000026',
    //   // 'scrollbarSlider.hoverBackground': '#00000040',
    //   // 'scrollbarSlider.activeBackground': '#00000059'
    // });

    await this.iconService.applyTheme(vscIconThemeExt.pkgJSON.contributes.iconThemes[0].id);
  }
}
