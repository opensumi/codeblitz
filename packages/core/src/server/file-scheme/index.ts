import { Injectable } from '@ali/common-di'
import {
  IFileSchemeDocNodeService,
  FileSchemeDocNodeServicePath,
} from '@ali/ide-file-scheme/lib/common'
import { NodeModule } from '../core/app'

import { FileSchemeDocNodeServiceImpl } from './file-scheme-doc.service'

@Injectable()
export class FileSchemeNodeModule extends NodeModule {
  providers = [
    {
      token: IFileSchemeDocNodeService,
      useClass: FileSchemeDocNodeServiceImpl,
    },
  ]

  backServices = [
    {
      servicePath: FileSchemeDocNodeServicePath,
      token: IFileSchemeDocNodeService,
    },
  ]
}
