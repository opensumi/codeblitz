declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        IS_DEV: boolean;
        EXTENSION_WORKER_HOST: string;
      }
    }
  }
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
