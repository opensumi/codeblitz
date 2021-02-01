import { Autowired } from '@ali/common-di';
import { Domain, URI } from '@ali/ide-core-browser';
import {
  StaticResourceContribution,
  StaticResourceService,
} from '@ali/ide-static-resource/lib/browser/static.definition';
import { AppConfig, RuntimeConfig } from '@alipay/alex-core';
import * as paths from 'path';
import { GitModelService } from './git-model.service';

@Domain(StaticResourceContribution)
export class GitStaticResourceContribution implements StaticResourceContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired()
  gitModel: GitModelService;

  registerStaticResolver(staticService: StaticResourceService) {
    if (!this.runtimeConfig.git) return;
    const { transformStaticResource, baseURL } = this.runtimeConfig.git;
    if (transformStaticResource) {
      staticService.registerStaticResourceProvider({
        scheme: 'file',
        resolveStaticResource: (uri: URI) => {
          const fsPath = uri.codeUri.path;
          const path = paths.relative(this.appConfig.workspaceDir, fsPath);
          const { project, projectId, branch, commit, platform } = this.gitModel;
          const url = transformStaticResource({
            platform,
            project,
            projectId,
            branch,
            commit,
            path,
            baseURL,
          });
          return new URI(url);
        },
        roots: [baseURL],
      });
    }
  }
}
