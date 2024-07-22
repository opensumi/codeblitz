import { Autowired, Injectable } from '@opensumi/di';
import { localize, MaybePromise, URI, WithEventBus } from '@opensumi/ide-core-browser';
import { IResource, IResourceProvider } from '@opensumi/ide-editor';
import { IconType, IIconService } from '@opensumi/ide-theme';
import { EXTENSION_SCHEME } from './base';
import * as styles from './common.module.less';

@Injectable()
export class ExtensionResourceProvider extends WithEventBus implements IResourceProvider {
  readonly scheme: string = EXTENSION_SCHEME;

  @Autowired(IIconService)
  iconService: IIconService;

  provideResource(uri: URI): MaybePromise<IResource<any>> {
    const { name, icon } = uri.getParsedQuery();
    const iconClass = this.iconService.fromIcon('', icon, IconType.Background);
    return {
      name: `${localize('marketplace.extension.container')}: ${name}`,
      icon: `${iconClass} ${styles.tab_icon}`,
      uri,
    };
  }
}
