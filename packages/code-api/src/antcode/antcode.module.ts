import { Injectable, Provider } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { ContentSearchServerPath } from '@ali/ide-search/lib/common';
import { FileSearchServicePath } from '@ali/ide-file-search/lib/common';

import { AntCodeService } from './antcode.service';
import { SearchContribution } from '../common/search/search.contributon';
import { ContentSearchService } from '../common/search/content-search.service';
import { FileSearchService } from '../common/search/file-search.service';

@Injectable()
export class AntCodeModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ICodeAPIService,
      useClass: AntCodeService,
    },
    SearchContribution,
    {
      token: ContentSearchServerPath,
      useClass: ContentSearchService,
      override: true,
    },
    {
      token: FileSearchServicePath,
      useClass: FileSearchService,
      override: true,
    },
  ];
}
