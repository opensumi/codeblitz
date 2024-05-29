import { IRuntimeSocketConnection, WSChannel } from '@opensumi/ide-connection';
import { WSChannelHandler } from '@opensumi/ide-connection/lib/browser/ws-channel-handler';
import {
  ClientPort,
  CodeBlitzConnection,
  CodeBlitzMessageIO,
  codeblitzSerializer,
} from '../../connection';
import { BaseConnectionHelper } from '@opensumi/ide-core-browser/lib/application/runtime/base-socket';
import { Injectable } from '@opensumi/di';
import {
  ModuleConstructor,
  createConnectionService,
  getDebugLogger,
} from '@opensumi/ide-core-browser';

@Injectable({ multiple: true })
export class CodeBlitzConnectionHelper extends BaseConnectionHelper {
  getDefaultClientId() {
    return 'codeblitz';
  }
  createConnection(): IRuntimeSocketConnection {
    return new CodeBlitzConnection(ClientPort);
  }

  createRPCServiceChannel(modules: ModuleConstructor[]): Promise<WSChannel> {
    const initialLogger = getDebugLogger();
    const connection: IRuntimeSocketConnection<Uint8Array> = this.createConnection();
    const clientId: string = this.appConfig.clientId ?? this.getDefaultClientId();
    const channelHandler = new WSChannelHandler(connection, clientId, {
      channelSerializer: codeblitzSerializer,
      logger: initialLogger,
    });

    return createConnectionService(this.injector, modules, channelHandler, {
      io: new CodeBlitzMessageIO(),
    });
  }
}
