import { IDisposable, Listener } from './types';

const noop = () => {};

class CenterRegistry {
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
    disposables?: IDisposable[]
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
}

export const centerRegistry = new CenterRegistry();
