import { Injectable } from '@ali/common-di'
import { IDiskFileProvider, DiskFileServicePath } from '@ali/ide-file-service/lib/common'
import { NodeModule } from '../core/app'
import { DiskFileSystemProvider } from './disk-file-system.provider'

@Injectable()
export class FileServiceModule extends NodeModule {
  providers = [
    {
      token: IDiskFileProvider,
      useClass: DiskFileSystemProvider,
    },
  ]

  backServices = [
    {
      servicePath: DiskFileServicePath,
      token: IDiskFileProvider,
    },
  ]
}
