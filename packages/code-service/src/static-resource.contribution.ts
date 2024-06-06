import { CodePlatformRegistry, ICodeAPIProvider } from '@codeblitzjs/ide-code-api';
import { AppConfig, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { Autowired } from '@opensumi/di';
import { Domain, URI } from '@opensumi/ide-core-browser';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@opensumi/ide-core-browser/lib/static-resource/static.definition';
import * as paths from 'path';
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
    const configs = CodePlatformRegistry.instance().getCodePlatformConfigs();

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
      roots: Object.values(configs).map((config) => config.origin),
    });
  }
}
