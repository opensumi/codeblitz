import { Autowired } from '@ali/common-di';
import { Domain } from '@ali/ide-core-common';
import { FsProviderContribution, ClientAppContribution } from '@ali/ide-core-browser';
import { IFileServiceClient, IDiskFileProvider } from '@ali/ide-file-service';
import { GitAPIService } from './git-api.service';

@Domain(FsProviderContribution, ClientAppContribution)
export class GitContribution implements FsProviderContribution, ClientAppContribution {
  @Autowired(IDiskFileProvider)
  gitFsClient: IDiskFileProvider;

  @Autowired()
  gitApiService: GitAPIService;

  registerProvider(registry: IFileServiceClient) {
    registry.registerProvider('file', this.gitFsClient);
  }

  initialize() {
    // TODO: 测试使用
    return this.gitApiService.init({ project: 'ide-s/TypeScript-Node-Starter' });
  }
}
