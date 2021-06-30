export interface IDisposable {
  dispose(): void;
}

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
}

export type Listener<T> = [(e: T) => void, any] | ((e: T) => void);
