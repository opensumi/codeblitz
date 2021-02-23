import { Autowired } from '@ali/common-di';
import { Domain, URI } from '@ali/ide-core-browser';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@ali/ide-static-resource/lib/browser/static.definition';
import { AppConfig, RuntimeConfig } from '@alipay/alex-core';
import * as paths from 'path';
import { ICodeAPIService } from './types';
import { CodeModelService } from './code-model.service';

@Domain(StaticResourceContribution)
export class CodeStaticResourceContribution implements StaticResourceContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(ICodeAPIService)
  codeAPI: ICodeAPIService;

  @Autowired()
  codeModel: CodeModelService;

  registerStaticResolver(staticService: StaticResourceService) {
    if (!this.runtimeConfig.codeService || !this.codeAPI.transformStaticResource) return;
    staticService.registerStaticResourceProvider({
      scheme: 'file',
      resolveStaticResource: (uri: URI) => {
        const fsPath = uri.codeUri.path;
        const path = paths.relative(this.appConfig.workspaceDir, fsPath);
        const url = this.codeAPI.transformStaticResource(path);
        return new URI(url);
      },
      roots: [this.codeModel.origin],
    });
  }
}
