export const RuntimeConfig = Symbol('RuntimeConfig');

export interface IRuntimeConfig {
  scene: string;
  [key: string]: any;
}
