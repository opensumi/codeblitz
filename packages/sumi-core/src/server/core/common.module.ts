import { Injectable } from '@opensumi/di';
import { CommonServerProtocol } from '@opensumi/ide-connection/lib/common/protocols/common-server';
import { CommonServerPath, ICommonServer } from '@opensumi/ide-core-common';
import { NodeModule } from './app';
import { FileSystemContribution } from './base';
import { CommonServer } from './common.server';
import { FileSystemConfigContribution, FileSystemLaunchContribution } from './fs-launch.contribution';

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
      protocol: CommonServerProtocol,
    },
  ];
  contributionProvider = [FileSystemContribution];
}
