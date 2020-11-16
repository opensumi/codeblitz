import { Injectable } from '@ali/common-di'
import { LogServiceManager } from './log-manager'
import {
  LogServiceForClientPath,
  ILogServiceForClient,
  ILogServiceManager,
} from '@ali/ide-logs/lib/common'
import { LogServiceForClient } from './log.service'
import { NodeModule } from '../core/app'

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
  ]

  backServices = [
    {
      servicePath: LogServiceForClientPath,
      token: ILogServiceForClient,
    },
  ]
}
