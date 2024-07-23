import { Injectable } from '@opensumi/di';
import { NodeModule } from '../core/app';
import { ILogServiceManager } from '../core/base';
import { ILogServiceForClient, LogServiceForClientPath } from './base';
import { LogServiceManager } from './log-manager';
import { LogServiceForClient } from './log.service';

export * from './base';

@Injectable()
export class LogServiceModule extends NodeModule {
  providers = [
    {
      token: ILogServiceForClient,
      useClass: LogServiceForClient,
    },
    {
      token: ILogServiceManager,
      useClass: LogServiceManager,
    },
  ];

  backServices = [
    {
      servicePath: LogServiceForClientPath,
      token: ILogServiceForClient,
    },
  ];
}
