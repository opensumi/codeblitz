import { Injectable } from '@opensumi/di';
import { ICommonServer, CommonServerPath } from '@opensumi/ide-core-common';
import { NodeModule } from './app';
import { CommonServer } from './common.server';
import { FileSystemContribution } from './base';
import {
  FileSystemLaunchContribution,
  FileSystemConfigContribution,
} from './fs-launch.contribution';
@Injectable()
export class ServerCommonModule extends NodeModule {
  providers = [
    {
      token: ICommonServer,
      useClass: CommonServer,
    },
    FileSystemLaunchContribution,
    FileSystemConfigContribution,
  ];
  backServices = [
    {
      servicePath: CommonServerPath,
      token: ICommonServer,
    },
  ];
  contributionProvider = [FileSystemContribution];
}
