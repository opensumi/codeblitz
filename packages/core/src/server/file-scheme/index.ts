import { Injectable } from '@ali/common-di';
import { IFileSchemeDocNodeService, FileSchemeDocNodeServicePath } from './base';
import { NodeModule } from '../core/app';

import { FileSchemeDocNodeServiceImpl } from './file-scheme-doc.service';

export * from './base';

@Injectable()
export class FileSchemeNodeModule extends NodeModule {
  providers = [
    {
      token: IFileSchemeDocNodeService,
      useClass: FileSchemeDocNodeServiceImpl,
    },
  ];

  backServices = [
    {
      servicePath: FileSchemeDocNodeServicePath,
      token: IFileSchemeDocNodeService,
    },
  ];
}
