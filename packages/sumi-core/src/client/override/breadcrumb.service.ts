import { Autowired, Injectable } from '@opensumi/di';
import { MaybeNull, URI } from '@opensumi/ide-core-browser';
import { BreadCrumbServiceImpl } from '@opensumi/ide-editor/lib/browser/breadcrumb';
import { IEditor } from '@opensumi/ide-editor/lib/common';
import { RuntimeConfig } from '../../common/types';

export { IBreadCrumbService } from '@opensumi/ide-editor/lib/browser/types';

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
