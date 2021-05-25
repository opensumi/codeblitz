import { Injectable, Autowired } from '@ali/common-di';
import { BreadCrumbServiceImpl } from '@ali/ide-editor/lib/browser/breadcrumb';
import { URI, MaybeNull } from '@ali/ide-core-browser';
import { IEditor } from '@ali/ide-editor/lib/common';
import { RuntimeConfig } from '../../common/types';

export { IBreadCrumbService } from '@ali/ide-editor/lib/browser/types';

@Injectable()
export class BreadCrumbServiceImplOverride extends BreadCrumbServiceImpl {
  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  getBreadCrumbs(uri: URI, editor: MaybeNull<IEditor>) {
    if (this.runtimeConfig.hideBreadcrumb) {
      return undefined;
    }
    return super.getBreadCrumbs(uri, editor);
  }
}
