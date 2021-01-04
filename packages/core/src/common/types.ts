import { BrowserFS } from '../server/node';

export type RootFS = InstanceType<typeof BrowserFS.FileSystem.MountableFileSystem>;

export const IServerApp = Symbol('IServerApp');

export interface IServerApp {
  start(): Promise<void>;
  rootFS: RootFS;
}
