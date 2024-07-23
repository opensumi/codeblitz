import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { FileSchemeDocNodeServicePath, IFileSchemeDocNodeService } from './base';

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
