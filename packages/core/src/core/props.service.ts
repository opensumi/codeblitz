import { Emitter, Event } from '@opensumi/ide-core-common';
import { useEffect, useRef, useState } from 'react';

interface PropsChangeEvent<P> {
  prevProps: P;
  props: P;
  affect<K extends keyof P>(k: K): boolean;
  affect<K1 extends keyof P, K2 extends keyof P[K1]>(k1: K1, k2: K2): boolean;
  affect<K1 extends keyof P, K2 extends keyof P[K1], K3 extends keyof P[K1][K2]>(
    k1: K1,
    k2: K2,
    k3: K3,
  ): boolean;
  affect<
    K1 extends keyof P,
    K2 extends keyof P[K1],
    K3 extends keyof P[K1][K2],
    K4 extends keyof P[K1][K2][K3],
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
  ): boolean;
  affect<
    K1 extends keyof P,
    K2 extends keyof P[K1],
    K3 extends keyof P[K1][K2],
    K4 extends keyof P[K1][K2][K3],
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    ...keys: (string | number | symbol)[]
  ): boolean;
}

const get = (obj: any, path: string[]) => {
  let index = 0;
  const length = path.length;

  while (obj != null && index < length) {
    obj = obj[path[index++]];
  }
  return index && index == length ? obj : undefined;
};

export const IPropsService = Symbol('IPropsService');

export interface IPropsService<P = {}> {
  readonly props: P;
  onPropsChange: Event<PropsChangeEvent<P>>;
}

export class PropsServiceImpl<P = {}> implements IPropsService<P> {
  private _props: P;

  get props() {
    return this._props;
  }

  set props(nextProps) {
    const prevProps = this._props;
    this._props = nextProps;
    this._firePropsChange(this._props, prevProps);
  }

  private _onPropsChange = new Emitter<PropsChangeEvent<P>>();

  readonly onPropsChange = this._onPropsChange.event;

  private _firePropsChange(props: P, prevProps: P) {
    this._onPropsChange.fire({
      prevProps,
      props,
      affect(...keys: string[]) {
        return get(props, keys) !== get(prevProps, keys);
      },
    });
  }
}

const refEquality = (a: any, b: any) => a === b;

function usePropsSelector<P>(service: IPropsService<P>): P;
function usePropsSelector<S, P>(
  service: IPropsService<P>,
  selector: (props: P) => S,
  isEqual?: (s1: S, s2: S) => boolean,
): S;
function usePropsSelector<S, P>(
  service: IPropsService<P>,
  selector?: (props: P) => S,
  isEqual: (s1: S, s2: S) => boolean = refEquality,
): typeof selector extends undefined ? P : S {
  const lastSelector = useRef(selector);
  lastSelector.current = selector;

  const [selectedState, setSelectedState] = useState(() => {
    const state = service.props;
    return lastSelector.current ? lastSelector.current(state!) : state;
  });

  const lastSelectedState = useRef(selectedState);
  lastSelectedState.current = selectedState;

  useEffect(() => {
    const disposer = service.onPropsChange(() => {
      try {
        if (lastSelector.current) {
          const newSelectedState = lastSelector.current(service.props);
          if (!isEqual(newSelectedState, lastSelectedState.current as S)) {
            lastSelectedState.current = newSelectedState;
            // 防止 newSelectedState 是函数，例如组件，这时直接传回被当做函数执行
            setSelectedState(() => newSelectedState);
          }
        } else {
          setSelectedState(() => service.props);
        }
      } catch (err) {
        console.error('dispatch handler error', err);
      }
    });
    return () => {
      disposer.dispose();
    };
  }, []);

  return selectedState as any;
}

export { usePropsSelector };
