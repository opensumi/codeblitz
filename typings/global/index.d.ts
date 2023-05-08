declare module '*.less';
declare module '*.css';

declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        IS_DEV: boolean;
      }
    }
  }
}

// build 时会被替换
declare var __DEV__: string;
declare var __WORKER_HOST__: string;
declare var __WEBVIEW_ENDPOINT__: string;
declare var __WEBVIEW_ENDPOINT_INTERNAL__: string;
declare var __WEBVIEW_SCRIPT__: string;
declare var __VERSION__: string;
declare var __ODPS_WORKER__: string;

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

declare module '@alipay/alex/extensions/*' {
  import { IExtensionBasicMetadata } from '@alipay/alex-shared';
  const metadata: IExtensionBasicMetadata;
  export = metadata;
}

declare module '@alipay/yuyan-monitor-web' {
  const m: any;
  export default m;
}

declare var Tracert: {
  spmAPos: string;
  spmBPos: string;
  get: Function;
  set: Function;
  click: Function;
  expo: Function;
  call: Function;
  before: Function;
  chInfo: string;
};
