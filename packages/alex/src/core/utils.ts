import { ModuleConstructor } from '@ali/ide-core-browser';
import { IAppOpts } from '@alipay/alex-core';
import { ThemeType } from '@ali/ide-theme';
import { IAppConfig } from '../api/types';

export const flatModules = (modules: Record<string, ModuleConstructor | ModuleConstructor[]>) => {
  return Object.keys(modules).reduce<ModuleConstructor[]>(
    (arr, key) => arr.concat(modules[key]),
    []
  );
};

export const mergeConfig = (target: IAppOpts, source: IAppConfig) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];
    switch (key) {
      case 'modules':
      case 'extensionMetadata':
        if (Array.isArray(sourceValue)) {
          sourceValue.forEach((value) => {
            if (targetValue.indexOf(value) < 0) {
              targetValue.push(value);
            }
          });
        }
        break;
      case 'defaultPreferences':
      case 'defaultPanels':
        Object.assign(targetValue, sourceValue);
        break;
      default:
        target[key] = sourceValue;
    }
  });
  return target;
};

export const themeStorage = {
  _key: 'alex:theme',
  get(): ThemeType {
    return localStorage.getItem(this._key) as ThemeType;
  },
  set(type: ThemeType) {
    if (type) {
      localStorage.setItem(this._key, type);
    } else {
      localStorage.removeItem(this._key);
    }
  },
};
