import React, { useEffect, useState, useRef } from 'react';
import { Emitter, Event } from '@ali/ide-core-common';

interface Handler<P = any> {
  (props: P): void;
}

interface Dispatcher<P = any> {
  subscribe(handler: Handler<P>): () => void;
  get(): P | undefined;
  update(props: P): void;
}

function createDispatcher<P = any>(props?: P): Dispatcher<P> {
  let handlers: Handler[] = [];
  return {
    subscribe(handler) {
      handlers.push(handler);
      return () => {
        handlers = handlers.filter((h) => h !== handler);
      };
    },
    get() {
      return props;
    },
    update(newProps) {
      props = newProps;
      handlers.forEach((handler) => handler(newProps));
    },
  };
}

const refEquality = (a: any, b: any) => a === b;

export function createContainer<P = Record<string, never>>() {
  const dispatcher = createDispatcher<P>()!;

  function Container({ children, value }: React.PropsWithChildren<{ value: P }>) {
    const firstRender = useRef(true);

    if (firstRender) {
      dispatcher.update(value);
    }

    useEffect(() => {
      if (!firstRender.current) {
        dispatcher.update(value);
      } else {
        firstRender.current = false;
      }
    });

    return <>{children}</>;
  }

  function useSelector(): P;
  function useSelector<S>(selector: (props: P) => S, isEqual?: (s1: S, s2: S) => boolean): S;
  function useSelector<S>(
    selector?: (props: P) => S,
    isEqual: (s1: S, s2: S) => boolean = refEquality
  ): typeof selector extends undefined ? P : S {
    const lastSelector = useRef(selector);
    lastSelector.current = selector;

    const [selectedState, setSelectedState] = useState(() => {
      const state = dispatcher.get();
      return lastSelector.current ? lastSelector.current(state!) : state;
    });

    const lastSelectedState = useRef(selectedState);
    lastSelectedState.current = selectedState;

    useEffect(() => {
      return dispatcher.subscribe((e) => {
        try {
          if (lastSelector.current) {
            const newSelectedState = lastSelector.current(e);
            if (!isEqual(newSelectedState, lastSelectedState.current as S)) {
              lastSelectedState.current = newSelectedState;
              // 防止 newSelectedState 是函数，例如组件，这时直接传回被当做函数执行
              setSelectedState(() => newSelectedState);
            }
          } else {
            setSelectedState(() => e);
          }
        } catch (err) {
          console.error('dispatch handler error', err);
        }
      });
    }, []);

    return selectedState as any;
  }

  function select(): P;
  function select<S>(selector: (props: P) => S): S;
  function select<S>(selector?: (props: P) => S): typeof selector extends undefined ? P : S {
    const props = dispatcher.get();
    return selector ? selector(props!) : (props as any);
  }

  function onSelect(): Event<P>;
  function onSelect<S>(selector: (props: P) => S, isEqual?: (s1: S, s2: S) => boolean): Event<S>;
  function onSelect<S>(
    selector?: (props: P) => S,
    isEqual: (s1: S, s2: S) => boolean = refEquality
  ): typeof selector extends undefined ? Event<P> : Event<S> {
    const props = dispatcher.get();
    let selectedState = selector ? selector(props!) : props;
    let disposer: () => void;
    const emitter = new Emitter<any>({
      onFirstListenerAdd() {
        disposer = dispatcher.subscribe((e) => {
          try {
            if (selector) {
              const newSelectedState = selector(e);
              if (!isEqual(newSelectedState, selectedState as S)) {
                selectedState = newSelectedState;
                emitter.fire(selectedState);
              }
            } else {
              selectedState = e;
              emitter.fire(selectedState);
            }
          } catch (err) {
            console.error('dispatch handler error', err);
          }
        });
      },
      onLastListenerRemove() {
        disposer();
      },
    });

    return emitter.event;
  }

  return {
    Container,
    useSelector,
    select,
    onSelect,
  };
}
