/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

// import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import { GQL, Redis, Hive, ODPS, Shell, Blink, ADB } from 'bravo-parser';
import {
  IDisposable,
  Uri,
  Emitter,
  IEvent,
} from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { supportLanguage } from '../types';
import { DiagnosticsOptions, LanguageServiceDefaults } from './types';

class AbstractWorker {}

const WorkerMap = {
  ODPSSQL: {
    workerName: 'ODPSWorker',
    tokens: ODPS.tokens,
    
  },
};

export class WorkerManager {
  private _defaults: LanguageServiceDefaultsImpl;
  private _idleCheckInterval: NodeJS.Timeout;
  private _lastUsedTime: number;
  private _configChangeListener: IDisposable;

  private _worker: monaco.editor.MonacoWebWorker<AbstractWorker> | null;
  private _client: Promise<AbstractWorker> | null;
  private pendingPromises;
  private registeredLanguage;
  private workerInfo;
  private onWokerLoad;

  constructor(defaults: LanguageServiceDefaultsImpl, onWokerLoad?: Function) {
    this._defaults = defaults;
    this.onWokerLoad = onWokerLoad;
    this._worker = null;
    this._idleCheckInterval = setInterval(() => this._checkIfIdle(), 10 * 1000);
    this._lastUsedTime = 0;
    this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
    this.pendingPromises = [];
    this.registeredLanguage = [];
    this.workerInfo = new Proxy(
      { workerReady: false },
      {
        set: (obj, prop, value) => {
          if (prop === 'workerReady') {
            this.handleWorkerReadyStuff();
          }
          // The default behavior to store the value
          obj[prop] = value;
          return true;
        },
      }
    );
  }

  private _stopWorker(): void {
    if (this._worker) {
      this._worker.dispose();
      this._worker = null;
    }
    this._client = null;
  }

  dispose(): void {
    clearInterval(this._idleCheckInterval);
    this._configChangeListener.dispose();
    this._stopWorker();
  }

  private _checkIfIdle(): void {
    if (!this._worker) {
      return;
    }
    let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
    // 是否在内置的WorkerMap中，未注册的worker统一采用
    if (timePassedSinceLastUsed > this._defaults.workerMaxIdleTime) {
      this._stopWorker();
    }
  }

  private _getClient(): Promise<AbstractWorker> {
    this._lastUsedTime = Date.now();

    if (
      !this._client ||
      !this.registeredLanguage.find((item) => item === this._defaults.languageId)
    ) {
      const currentWorker = WorkerMap[this._defaults.languageId];

      this._worker = monaco.editor.createWebWorker<AbstractWorker>({
        // module that exports the create() method and returns a `AbstractWorker` instance
        moduleId: currentWorker?.workerName || this._defaults.languageId,
        // moduleId: 'sql.worker.js',

        label: this._defaults.languageId,

        // passed in to the create() method
        createData: {
          languageSettings: this._defaults.diagnosticsOptions,
          languageId: this._defaults.languageId,
          languageTokens: currentWorker?.tokens,
        },
      });

      this._client = this._worker.getProxy().then((_) => {
        this.workerInfo.workerReady = true;
        this.registeredLanguage.push(this._defaults.languageId);
        return _;
      });
    }

    return this._client;
  }

  /* worker创建未完成时，保存所有的promise，当worker创建成功后，执行最后一次计算逻辑 */
  getLanguageServiceWorker(...resources: Uri[]): Promise<AbstractWorker> {
    return new Promise((resolve, reject) => {
      if (this.workerInfo.workerReady) {
        resolve(this.getFinalClient(resources));
      }
      this.pendingPromises.push({
        resolve: resolve.bind(this, this.getFinalClient(resources)),
        reject: reject.bind(this, 'duplicate'),
      });
    });
  }

  getFinalClient = async (resources) => {
    let _client: AbstractWorker;
    const start = Date.now();
    const worker = await toShallowCancelPromise(
      this._getClient()
        .then((client) => {
          // console.log('init time:', new Date().getTime() - start);
          if (this.onWokerLoad) {
            this.onWokerLoad({
              loadTime: new Date().getTime() - start,
              language: this._defaults.languageId,
            });
          }
          _client = client;
        })
        .then((_) => {
          return this._worker!.withSyncedResources(resources);
        })
        .then((_) => _client)
        .catch((e) => {
          console.log(e);
        })
    );

    return worker;
  };

  handleWorkerReadyStuff() {
    const len = this.pendingPromises.length;
    if (len === 0) {
      return;
    }
    this.pendingPromises.pop().resolve();
    this.pendingPromises.forEach((p) => {
      p.reject();
    });
  }
}

function toShallowCancelPromise<T>(p: Promise<T>): Promise<T> {
  let completeCallback: (value: T) => void;
  let errorCallback: (err: any) => void;

  let r = new Promise<T>((c, e) => {
    completeCallback = c;
    errorCallback = e;
  });

  // @ts-ignore
  p.then(completeCallback, errorCallback);

  return r;
}

export class LanguageServiceDefaultsImpl {
  private _onDidChange = new Emitter<LanguageServiceDefaultsImpl>();
  private _diagnosticsOptions: DiagnosticsOptions;
  private _languageId: supportLanguage;
  private _workerMaxIdleTime;

  constructor(languageId: supportLanguage, diagnosticsOptions: DiagnosticsOptions) {
    this._languageId = languageId;
    this.setDiagnosticsOptions(diagnosticsOptions);
    this.setMaximunWorkerIdleTime(languageId);
  }

  get onDidChange(): IEvent<LanguageServiceDefaults> {
    return this._onDidChange.event;
  }

  get languageId(): supportLanguage {
    return this._languageId;
  }

  get workerMaxIdleTime(): number {
    return this._workerMaxIdleTime;
  }

  get diagnosticsOptions(): DiagnosticsOptions {
    return this._diagnosticsOptions;
  }

  setDiagnosticsOptions(options: DiagnosticsOptions): void {
    this._diagnosticsOptions = options || Object.create(null);
    this._onDidChange.fire(this);
  }

  setMaximunWorkerIdleTime(languageId: supportLanguage | string) {
    // 内置语法 worker 过期时间保持不变
    if (supportLanguage[languageId]) {
      this._workerMaxIdleTime = 2 * 60 * 1000;
      return;
    }
    // 非内置worker，用于开放平台自定义语法名，设置过期时间为5S，用于worker更新后响应
    this._workerMaxIdleTime = 5 * 1000;
  }
}
