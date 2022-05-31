import { ModuleConstructor } from '@opensumi/ide-core-browser';
import { IAppOpts } from '@alipay/alex-core';
import { getThemeId, getThemeType, ThemeContribution, BuiltinTheme } from '@opensumi/ide-theme';
import { IExtensionBasicMetadata } from '@alipay/alex-shared';

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
    const sourceValue = source[key];
    switch (key) {
      case 'modules':
      case 'extensionMetadata':
        if (Array.isArray(sourceValue)) {
          if (!target[key]) {
            target[key] = [];
          }
          const targetValue = target[key] as any[];
          sourceValue.forEach((value) => {
            if (targetValue.indexOf(value) < 0) {
              targetValue.push(value);
            }
          });
        }
        break;
      case 'defaultPreferences':
      case 'defaultPanels':
        if (!target[key]) {
          target[key] = {};
        }
        Object.assign(target[key], sourceValue);
        break;
      default:
        target[key] = sourceValue;
    }
  });
  return target;
};

export const getThemeTypeByPreferenceThemeId = (
  themeId: string,
  extensionMetadata: IExtensionBasicMetadata[] | undefined
) => {
  let uiTheme: BuiltinTheme | undefined;
  if (themeId && extensionMetadata) {
    for (const ext of extensionMetadata) {
      const theme: ThemeContribution | undefined = ext.packageJSON.contributes?.themes?.find(
        (contrib: ThemeContribution) => contrib && getThemeId(contrib) === themeId
      );

      if (theme?.uiTheme) {
        uiTheme = theme.uiTheme;
        break;
      }
    }
  }
  return getThemeType(uiTheme || 'vs-dark');
};
