import {
  Fragment,
  createRef,
  createElement,
  useEffect,
  useRef,
  useReducer,
  ComponentType,
  ComponentProps,
  ReactElement,
  RefObject,
  useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';

type EffectParams = Parameters<typeof useEffect>;

export interface PortalsProps {
  components: ComponentType[];
}

export interface PortalProps<C extends ComponentType> {
  // tag，默认 div
  tag?: string;
  // tag 上类名
  className?: string;
  // tag 上样式
  style?: React.CSSProperties;
  // portal effect，参数等同 useEffect 参数
  effect?: EffectParams;
  // 代理组件
  component: C;
  // 代理组件 props
  componentProps?: ComponentProps<C>;
}

interface PortalHolderProps<P = Record<string, never>> {
  effect?: EffectParams;
  componentProps: P;
  containerRef: RefObject<HTMLElement>;
}

const useInitial = <T>(fn: () => T): T => {
  const valueRef = useRef<T>();
  const initRef = useRef(false);
  if (!initRef.current) {
    valueRef.current = fn();
    initRef.current = true;
  }
  return valueRef.current as T;
};

const useUpdate = () => {
  const [, update] = useReducer((num: number) => num + 1, 0);
  return update;
};

const noopEffect: EffectParams = [() => {}, []];

const creatEventEmitter = <T = unknown>() => {
  type Listener = (e: T) => void;
  let listeners: Listener[] = [];
  return {
    event(listener: Listener) {
      listeners.push(listener);
      return () => this.off(listener);
    },
    off(listener: Listener) {
      listeners = listeners.filter((fn) => fn !== listener);
    },
    fire(e: T) {
      listeners.forEach((fn) => fn(e));
    },
  };
};

const genUniqId = (() => {
  let index = 0;
  return (prefix: string) => `${prefix ?? 'anonymous'}-${index++}`;
})();

export const createPortals = () => {
  const emitter = creatEventEmitter<{
    portalId: string;
    payload: PortalHolderProps & {
      component: ComponentType;
    };
  }>();

  const portalHolderMap = new Map<ComponentType, ComponentType<PortalHolderProps>>();

  const withPortal = (Component: ComponentType) => {
    if (!portalHolderMap.has(Component)) {
      const PortalHolder: React.FC<PortalHolderProps> = ({
        containerRef,
        componentProps,
        effect = noopEffect,
      }) => {
        useEffect(...effect);

        return ReactDOM.createPortal(
          createElement(Component, componentProps),
          containerRef.current!
        );
      };

      PortalHolder.displayName = `withPortal(${Component.displayName || Component.name})`;

      portalHolderMap.set(Component, PortalHolder);
    }

    return portalHolderMap.get(Component);
  };

  const Portals: React.FC<PortalsProps> = ({ components, children }) => {
    useInitial(() => components.map((Component) => withPortal(Component)));

    const portalChildrenRef = useRef<ReactElement[]>([]);
    const forceUpdate = useUpdate();

    useEffect(() => {
      const listener = ({ portalId, payload }) => {
        // listener 会频繁调用，为了使用最新的值用 ref 缓存, forceUpdate react 会合并更新
        const { current: portalChildren } = portalChildrenRef;
        if (payload) {
          const index = portalChildren.findIndex((element) => element.key === portalId);
          const newElement = createElement(portalHolderMap.get(payload.component)!, {
            key: portalId,
            componentProps: payload.componentProps,
            containerRef: payload.containerRef,
            effect: payload.effect,
          });
          if (index === -1) {
            // mount
            portalChildrenRef.current = [...portalChildren, newElement];
          } else {
            // update
            portalChildrenRef.current = portalChildren.map((element, i) =>
              i !== index ? element : newElement
            );
          }
        } else {
          // unmount
          portalChildrenRef.current = portalChildren.filter(({ key }) => key !== portalId);
        }
        forceUpdate();
      };
      emitter.event(listener);
      return () => emitter.off(listener);
    }, []);

    return createElement(Fragment, null, children, ...portalChildrenRef.current);
  };

  Portals.displayName = 'Portals';

  const Portal: <C extends ComponentType>(props: PortalProps<C>) => ReactElement = ({
    tag = 'div',
    className,
    style,
    effect,
    component,
    componentProps = {},
  }) => {
    if (!portalHolderMap.has(component)) {
      throw new Error(`no portal for ${component.displayName || component.name}`);
    }

    // portal 会存在多次渲染的情况，component 无法作为唯一 id
    const { portalId, containerRef } = useInitial<{
      portalId: string;
      containerRef: RefObject<HTMLElement>;
    }>(() => {
      return {
        portalId: genUniqId(component.displayName || component.name),
        containerRef: createRef<HTMLElement>(),
      };
    });

    // 父组件渲染时直接驱动子组件渲染，保持 react 组件间行为一致，需要 memo 在原组件上进行即可
    useLayoutEffect(() => {
      emitter.fire({
        portalId,
        payload: {
          effect,
          component,
          componentProps: componentProps as any,
          containerRef,
        },
      });
    });

    useEffect(
      () => () => {
        emitter.fire({
          portalId,
          payload: null as any,
        });
      },
      []
    );

    // 包装了一层，需要主要样式
    return createElement(tag, {
      ref: containerRef,
      className,
      style,
      'data-type': 'portal',
    });
  };

  return {
    Portals,
    Portal,
  };
};

const { Portals, Portal } = createPortals();

export { Portals, Portal };
