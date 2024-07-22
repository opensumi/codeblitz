import { Injector } from '@opensumi/di';
import { useRef } from 'react';
import { IAppInstance } from '../api/types';

export const useConstant = <T>(fn: () => T): T => {
  const valueRef = useRef<{ v: T }>();
  if (!valueRef.current) {
    valueRef.current = { v: fn() };
  }
  return valueRef.current.v;
};

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
