import { Injectable, Provider } from '@opensumi/di';
import { DiskFileServiceProtocol } from '@opensumi/ide-file-service/lib/common/protocols/disk-file-service';
import { NodeModule } from '../core/app';
import { DiskFileServicePath, FileServicePath, IDiskFileProvider, IFileService } from './base';
import { DiskFileSystemProvider } from './disk-file-system.provider';
import { getSafeFileService } from './file-service';

export * from './base';

@Injectable()
export class FileServiceModule extends NodeModule {
  providers: Provider[] = [
    {
      token: IDiskFileProvider,
      useClass: DiskFileSystemProvider,
    },
    {
      token: IFileService,
      useFactory: getSafeFileService,
    },
  ];

  backServices = [
    {
      servicePath: DiskFileServicePath,
      token: IDiskFileProvider,
      protocol: DiskFileServiceProtocol,
    },
    {
      servicePath: FileServicePath,
      token: IFileService,
    },
  ];
}
