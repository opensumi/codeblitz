// @ts-nocheck

// TODO:
/**
 * kaitian 没有在 dispose terminal worker
 * 临时 override，待 PR
 */

import { Injectable } from '@ali/common-di';
import { Deferred, Emitter } from '@ali/ide-core-common';
import { WorkerExtensionService } from '@ali/ide-kaitian-extension/lib/browser/extension.worker.service';
import { IRPCProtocol } from '@ali/ide-connection/lib/common/rpcProtocol';

@Injectable()
export class WorkerExtensionServicePatch extends WorkerExtensionService {
  private extendWorkerHost: Worker;

  initWorkerProtocol(workerUrl: string): Promise<IRPCProtocol> {
    this.logger.log('[Worker Host] init web worker extension host');

    return new Promise((resolve, reject) => {
      const ready = new Deferred<MessagePort>();
      const onMessageEmitter = new Emitter<any>();
      try {
        const extendWorkerHost = new Worker(workerUrl, { name: 'KaitianWorkerExtensionHost' });
        this.extendWorkerHost = extendWorkerHost;
        extendWorkerHost.onmessage = (e) => {
          if (e.data instanceof MessagePort) {
            ready.resolve(e.data);
          }
        };

        ready.promise.then((port) => {
          resolve(this.createProtocol(port, onMessageEmitter));
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  dispose() {
    this.extendWorkerHost.terminate();
  }
}
