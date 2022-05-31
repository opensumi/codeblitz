import { Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { MergeRequestContribution } from './merge-request.contribution';
import { ChangesTreeContribution } from './changes-tree/changes-tree.contribution';
import { WebSCMContribution } from './web-scm/web-scm.contribution';
import { IDmpService } from './web-scm/common';
import { DmpServiceImpl } from './web-scm/dmp-service';
import { WebSCMDebugContribution } from './web-scm/web-scm-debug.contribution';

@Injectable()
export class MergeRequestModule extends BrowserModule {
  providers = [
    ChangesTreeContribution,
    WebSCMContribution,
    WebSCMDebugContribution,
    MergeRequestContribution,
    {
      token: IDmpService,
      useClass: DmpServiceImpl,
    },
  ];
}
