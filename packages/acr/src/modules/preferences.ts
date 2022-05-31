import { Injector } from '@opensumi/di';
import {
  PreferenceService,
  PreferenceProxy,
  createPreferenceProxy,
  PreferenceSchema,
  localize,
} from '@opensumi/ide-core-browser';

export const antCodePreferenceSchema: PreferenceSchema = {
  id: 'acr',
  type: 'object',
  properties: {
    'acr.lsifEnabled': {
      type: 'boolean',
      description: localize('acr.lsifEnable.desc'),
      default: true,
    },
    'acr.foldingEnabled': {
      type: 'boolean',
      description: localize('acr.foldingEnabled.desc'),
      default: true,
    },
  },
};

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface AntCodeConfiguration {}

export const AntCodePreferences = Symbol('AntCodePreferences');
export type AntCodePreferences = PreferenceProxy<AntCodeConfiguration>;

export function bindAntCodePreference(injector: Injector) {
  injector.addProviders({
    token: AntCodePreferences,
    useFactory: (injector: Injector) => {
      const preferences: PreferenceService = injector.get(PreferenceService);
      return createPreferenceProxy(preferences, antCodePreferenceSchema);
    },
  });
}
