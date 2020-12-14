declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        IS_DEV: boolean;
        WORKER_HOST: string;
        WEBVIEW_ENDPOINT: string;
      }
    }
  }
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
