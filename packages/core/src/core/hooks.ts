import { Injector } from '@opensumi/di';
import { useRef, useMemo, useCallback } from 'react';
import { IAppInstance } from '../api/types';

export const useConstant = <T>(fn: () => T): T => {
  const valueRef = useRef<{ v: T }>();
  if (!valueRef.current) {
    valueRef.current = { v: fn() };
  }
  return valueRef.current.v;
};

export function useMemorizeFn<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = useMemo(() => fn, [fn]);
  return useCallback((...args: any) => fnRef.current(...args), []) as T;
}

export let singleInjector: Injector | null = null;

export function setSingleInjector(inject) {
  singleInjector = inject;
}

export let singleApp: IAppInstance | null = null;

export function setSingleApp(app: IAppInstance) {
  singleApp = app;
}

export let isRendered = false;

export const setRendered = () => {
  isRendered = true;
};
