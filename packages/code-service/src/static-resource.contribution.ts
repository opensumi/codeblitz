import { Autowired } from '@ali/common-di';
import { Domain, URI } from '@ali/ide-core-browser';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@ali/ide-static-resource/lib/browser/static.definition';
import { AppConfig, RuntimeConfig } from '@alipay/alex-core';
import * as paths from 'path';
import { ICodeAPIProvider, CODE_PLATFORM_CONFIG, CodePlatform } from '@alipay/alex-code-api';
import { CodeModelService } from './code-model.service';

@Domain(StaticResourceContribution)
export class CodeStaticResourceContribution implements StaticResourceContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(ICodeAPIProvider)
  codeAPI: ICodeAPIProvider;

  @Autowired()
  codeModel: CodeModelService;

  registerStaticResolver(staticService: StaticResourceService) {
    staticService.registerStaticResourceProvider({
      scheme: 'file',
      resolveStaticResource: (uri: URI) => {
        const fsPath = uri.codeUri.path;
        const repo = this.codeModel.getRepository(fsPath);
        if (repo) {
          const relativePath = paths.relative(repo.root, fsPath);
          const url = repo.request.transformStaticResource(relativePath);
          return new URI(url);
        }
        return uri;
      },
      roots: [
        CODE_PLATFORM_CONFIG[CodePlatform.antcode].origin,
        CODE_PLATFORM_CONFIG[CodePlatform.github].origin,
        CODE_PLATFORM_CONFIG[CodePlatform.gitlab].origin,
      ],
    });
  }
}
