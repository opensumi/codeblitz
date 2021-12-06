/// <reference path="./isomorphic-git.d.ts" />

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

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

// FIXME: acr 升级后去掉
declare module '@alipay/acr-ide';
declare module '@alipay/acr-ide/*' {
  export const getLocale: any;
  export type IAntcodeCRProps = any;
  export enum AntcodeEncodingType {
    gbk = 'gbk',
    utf8 = 'utf-8',
  }
  export type Annotation = any;
  export type CheckSuite = any;
  export type FileAction = any;
  export type FileActionHeader = any;
  export type User = any;
}

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
