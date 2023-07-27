import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { ContentSearchService } from './content-search.service';
import { IContentSearchServer, ContentSearchServerPath } from './base';

@Injectable()
export class SearchModule extends NodeModule {
  providers = [
    {
      token: IContentSearchServer,
      useClass: ContentSearchService,
    },
  ];

  backServices = [
    {
      servicePath: ContentSearchServerPath,
      token: IContentSearchServer,
    },
  ];
}
