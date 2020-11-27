import { Injectable, Provider } from '@ali/common-di';
import {
  IDiskFileProvider,
  DiskFileServicePath,
  IFileService,
  FileServicePath,
} from '@ali/ide-file-service/lib/common';
import { NodeModule } from '../core/app';
import { DiskFileSystemProvider } from './disk-file-system.provider';
import { getSafeFileService } from './file-service';

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
