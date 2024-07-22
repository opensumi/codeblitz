import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { ContentSearchServerPath, IContentSearchServer } from './base';
import { ContentSearchService } from './content-search.service';

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
