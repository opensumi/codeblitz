import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { FileSearchServicePath, IFileSearchService } from './base';
import { FileSearchService } from './file-search.service';

@Injectable()
export class FileSearchModule extends NodeModule {
  providers = [
    {
      token: IFileSearchService,
      useClass: FileSearchService,
    },
  ];

  backServices = [
    {
      token: IFileSearchService,
      servicePath: FileSearchServicePath,
    },
  ];
}
