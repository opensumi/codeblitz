import { ReconnectingWebSocketConnection } from '@opensumi/ide-connection/lib/common/connection/drivers/reconnecting-websocket';
import { WebConnectionHelper } from '@opensumi/ide-core-browser/lib/application/runtime';
import { ClientPort, CodeBlitzConnection } from '../../connection';

export class CodeBlitzConnectionHelper extends WebConnectionHelper {
  getDefaultClientId() {
    return 'codeblitz';
  }
  createConnection(): ReconnectingWebSocketConnection {
    return new CodeBlitzConnection(ClientPort) as any;
  }
}
