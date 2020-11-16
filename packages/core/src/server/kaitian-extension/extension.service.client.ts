import { Injectable } from '@ali/common-di'
import type { IExtensionNodeClientService, IExtensionMetaData } from './common'
import { nodeLessExtensions } from './mock'

@Injectable()
export class ExtensionServiceClientImpl implements IExtensionNodeClientService {
  getElectronMainThreadListenPath(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  async getAllExtensions(): Promise<IExtensionMetaData[]> {
    return nodeLessExtensions
  }
  createProcess(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getExtension(): Promise<IExtensionMetaData | undefined> {
    throw new Error('Method not implemented.')
  }
  infoProcessNotExist(): void {
    throw new Error('Method not implemented.')
  }
  infoProcessCrash(): void {
    throw new Error('Method not implemented.')
  }
  disposeClientExtProcess(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  updateLanguagePack(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
