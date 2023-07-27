import { Injectable, Provider } from '@opensumi/di';
import { IDiskFileProvider, DiskFileServicePath, IFileService, FileServicePath } from './base';
import { NodeModule } from '../core/app';
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
    },
    {
      servicePath: FileServicePath,
      token: IFileService,
    },
  ];
}
