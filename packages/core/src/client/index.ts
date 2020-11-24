import { Injectable, Injector, ConstructorOf, Provider } from '@ali/common-di'
import {
  BrowserModule,
  ClientApp as BasicClientApp,
  IAppRenderer,
  IClientAppOpts as IBasicClientAppOpts,
} from '@ali/ide-core-browser'
import { BasicModule } from '@ali/ide-core-common'

import { FCServiceCenter, ClientPort, initFCService } from '../connection'
import { KaitianExtFsProvider, KtExtFsProviderContribution } from './extension'
import { TextmateLanguageGrammarContribution } from './textmate-language-grammar/index.contribution'
import { ILanguageGrammarRegistrationService } from './textmate-language-grammar/base'
import { LanguageGrammarRegistrationService } from './textmate-language-grammar/language-grammar.service'
import { IServerApp } from '../common'

export * from './extension'

export type ModuleConstructor = ConstructorOf<BrowserModule>

@Injectable()
export class ClientModule extends BrowserModule {
  providers = [
    KaitianExtFsProvider,
    KtExtFsProviderContribution,
    TextmateLanguageGrammarContribution,
    {
      token: ILanguageGrammarRegistrationService,
      useClass: LanguageGrammarRegistrationService,
    },
  ]
}

export interface IClientAppOpts extends IBasicClientAppOpts {
  serverApp: IServerApp
}

export class ClientApp extends BasicClientApp {
  constructor(opts: IClientAppOpts) {
    super(opts)
    opts.injector?.addProviders({
      token: IServerApp,
      useValue: opts.serverApp,
    })
  }

  public async start(container: HTMLElement | IAppRenderer, type?: string): Promise<void> {
    bindConnectionService(this.injector, this.modules)
    return super.start(container, type)
  }

  public dispose() {
    this.injector.disposeAll()
    this.injector.get(IServerApp).dispose()
  }
}

export async function bindConnectionService(injector: Injector, modules: ModuleConstructor[]) {
  const clientCenter = new FCServiceCenter(ClientPort)

  const { getFCService } = initFCService(clientCenter)

  for (const module of modules) {
    const moduleInstance = injector.get(module) as BasicModule
    if (!moduleInstance.backServices) {
      continue
    }
    for (const backService of moduleInstance.backServices) {
      const { servicePath } = backService
      const fcService = getFCService(servicePath)

      const injectService = {
        token: servicePath,
        useValue: fcService,
      } as Provider

      injector.addProviders(injectService)

      if (backService.clientToken) {
        const clientService = injector.get(backService.clientToken)
        fcService.onRequestService(clientService)
      }
    }
  }
}
