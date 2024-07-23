import { Injectable } from '@opensumi/di';
import { IRuntimeSocketConnection, WSChannel } from '@opensumi/ide-connection';
import { WSChannelHandler } from '@opensumi/ide-connection/lib/browser/ws-channel-handler';
import { RawMessageIO } from '@opensumi/ide-connection/lib/common/rpc/message-io';
import { rawSerializer } from '@opensumi/ide-connection/lib/common/serializer/raw';
import { createConnectionService, getDebugLogger, ModuleConstructor } from '@opensumi/ide-core-browser';
import { BaseConnectionHelper } from '@opensumi/ide-core-browser/lib/application/runtime/base-socket';
import { ClientPort, CodeBlitzConnection } from '../../connection';

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
      serializer: rawSerializer,
      logger: initialLogger,
    });

    return createConnectionService(this.injector, modules, channelHandler, {
      io: new RawMessageIO(),
    });
  }
}
