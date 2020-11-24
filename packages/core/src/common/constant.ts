export const EXT_SCHEME = 'kt-ext'

export const HOME = '/root'

export const EXTENSION_DIR = '.kaitian'

export const WORKSPACE_DIR = '/root/workspace'

export const IServerApp = Symbol('IServerApp')

export interface IServerApp {
  start(): Promise<void>
  dispose(): void
}

export const IndexedDBName = 'spacex-file-system'
