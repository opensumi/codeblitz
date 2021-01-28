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

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
