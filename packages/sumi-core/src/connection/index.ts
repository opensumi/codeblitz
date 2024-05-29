/**
 * Function Call Service Connection
 * 连接 Cline 和 Server, RPC 的模拟实现
 */
import { SimpleConnection } from '@opensumi/ide-connection/lib/common/connection/drivers/simple';
import { IRuntimeSocketConnection, ISerializer } from '@opensumi/ide-connection';
import { BaseMessageIO, RPCMessage } from '@opensumi/ide-connection/lib/common/rpc/message-io';
import { Disposable, IDisposable } from '@opensumi/ide-core-common';
import {
  TSumiProtocolMethod,
  IRequestHeaders,
  RPCRequestMessage,
  OperationType,
  RPCNotificationMessage,
  RPCCancelMessage,
  RPCResponseMessage,
  RPCErrorMessage,
} from '@opensumi/ide-connection/lib/common/rpc';

export interface Port {
  listen(cb: (...args: any[]) => any): void;
  call(...args: any): any;
}

const createChannel: () => { port1: Port; port2: Port } = () => {
  type InnerPort = {
    callback(...args: any[]): any;
    listen(cb: (...args: any[]) => any): void;
    call(...args: any[]): any;
    _entangledPort: InnerPort | null;
  };

  const noop = () => {};

  const createPort: (name: string) => InnerPort = (name) => ({
    _entangledPort: null,
    _name: name,
    callback: noop,
    listen(cb: (...args: any[]) => any) {
      this.callback = cb;
    },
    call(...args: any) {
      return this._entangledPort?.callback(...args);
    },
  });

  const port1 = createPort('client');
  const port2 = createPort('server');
  port1._entangledPort = port2;
  port2._entangledPort = port1;
  return { port1, port2 };
};

const { port1, port2 } = createChannel();

export { port1 as ClientPort, port2 as ServerPort };

export abstract class RPCService {
  client?: any;
}

export const codeblitzSerializer: ISerializer<any, any> = {
  serialize(data: any) {
    return data;
  },
  deserialize(data: any) {
    return data;
  },
};

export class CodeBlitzConnection extends SimpleConnection implements IRuntimeSocketConnection {
  constructor(port: Port) {
    super({
      onMessage(cb) {
        port.listen(cb);
        return Disposable.None;
      },
      send(data) {
        port.call(data);
      },
    });
  }
  onOpen(cb: () => void): IDisposable {
    return Disposable.None;
  }
  onClose(cb: (code?: number | undefined, reason?: string | undefined) => void): IDisposable {
    return Disposable.None;
  }
  onError(cb: (error: Error) => void): IDisposable {
    return Disposable.None;
  }
  isOpen(): boolean {
    return true;
  }
}

export class CodeBlitzMessageIO implements BaseMessageIO {
  Request(
    requestId: number,
    method: string,
    headers: IRequestHeaders,
    args: any[]
  ): RPCRequestMessage {
    return {
      kind: OperationType.Request,
      requestId,
      method,
      headers,
      args,
    };
  }
  Notification(
    requestId: number,
    method: string,
    headers: IRequestHeaders,
    args: any[]
  ): RPCNotificationMessage {
    return {
      kind: OperationType.Notification,
      requestId,
      method,
      headers,
      args,
    };
  }
  Cancel(requestId: number): RPCCancelMessage {
    return {
      kind: OperationType.Cancel,
      requestId,
    };
  }
  Response(
    requestId: number,
    method: string,
    headers: Record<string, any>,
    result: any
  ): RPCResponseMessage {
    return {
      kind: OperationType.Response,
      requestId,
      headers,
      method,
      result,
    };
  }
  Error(
    requestId: number,
    method: string,
    headers: Record<string, any>,
    error: any
  ): RPCErrorMessage {
    return {
      kind: OperationType.Error,
      requestId,
      method,
      headers,
      error,
    };
  }
  readMessage(data: any): RPCMessage {
    return data;
  }
}
