import { Injectable } from '@ali/common-di';
import { LogServiceManager } from './log-manager';
import { LogServiceForClientPath, ILogServiceForClient } from './base';
import { ILogServiceManager } from '../core/base';
import { LogServiceForClient } from './log.service';
import { NodeModule } from '../core/app';

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
