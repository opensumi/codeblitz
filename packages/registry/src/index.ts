import { IDisposable, Listener } from './types';

const noop = () => {};

const ok = (value?: unknown, message?: string) => {
  if (!value) {
    throw new Error(message ? `Assertion failed (${message})` : 'Assertion Failed');
  }
};

class RegistryImpl {
  private readonly instanceMap = new Map<string, any>();
  private readonly dataMap = new Map<string, any[]>();
  private readonly eventsMap = new Map<string, Listener<any>[]>();

  register<T>(id: string, data: T) {
    if (!this.dataMap.has(id)) {
      this.dataMap.set(id, []);
    }
    this.dataMap.get(id)!.push(data);

    if (this.eventsMap.has(id)) {
      this.eventsMap.get(id)!.forEach((fn) => {
        if (typeof fn === 'function') {
          fn.call(undefined, data);
        } else {
          fn[0].call(fn[1], data);
        }
      });
    }
  }

  onRegister<T>(
    id: string,
    fn: (e: T) => any,
    context?: any,
    disposables?: IDisposable[],
  ): IDisposable {
    const listener: Listener<T> = !context ? fn : [fn, context];
    const listeners = this.eventsMap.get(id);
    if (!listeners) {
      this.eventsMap.set(id, [listener]);
    } else {
      listeners.push(listener);
    }

    const result: IDisposable = {
      dispose: () => {
        result.dispose = noop;
        const listeners = this.eventsMap.get(id);
        if (!listeners) {
          return;
        }
        const remainListeners = listeners.filter((fn) => fn !== listener);
        if (remainListeners.length) {
          this.eventsMap.set(id, remainListeners);
        } else {
          this.eventsMap.delete(id);
        }
      },
    };

    if (Array.isArray(disposables)) {
      disposables.push(result);
    }

    return result;
  }

  getData<T>(id: string): T[] | undefined {
    return this.dataMap.get(id);
  }

  /**
   * 添加单实例
   */
  public add(id: string, data: any): void {
    ok(typeof id === 'string');
    ok(!this.instanceMap.has(id), 'There is already an extension with this id');

    this.instanceMap.set(id, data);
  }

  public knows(id: string): boolean {
    return this.instanceMap.has(id);
  }

  public as(id: string): any {
    return this.instanceMap.get(id) || null;
  }
}

export const Registry = new RegistryImpl();
