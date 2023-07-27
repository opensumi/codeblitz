import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { FileSearchService } from './file-search.service';
import { IFileSearchService, FileSearchServicePath } from './base';

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
