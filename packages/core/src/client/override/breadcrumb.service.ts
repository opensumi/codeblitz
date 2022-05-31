import { Injectable, Autowired } from '@opensumi/di';
import { BreadCrumbServiceImpl } from '@opensumi/ide-editor/lib/browser/breadcrumb';
import { URI, MaybeNull } from '@opensumi/ide-core-browser';
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
