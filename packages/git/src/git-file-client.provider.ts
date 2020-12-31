import { Injectable, Autowired } from '@ali/common-di';
import { Uri, FileType } from '@ali/ide-core-common';
import { DiskFsProviderClient } from '@ali/ide-file-service/lib/browser/file-service-provider-client';
import { FileStat } from '@ali/ide-file-service';
import { GitAPIService } from './git-api.service';

@Injectable()
export class GitFsProviderClient extends DiskFsProviderClient {
  @Autowired()
  gitApiService: GitAPIService;

  async stat(uri: Uri): Promise<FileStat> {
    const tree = await this.gitApiService.getTree();
    console.log('>>>111', tree);
    return {
      uri: Uri.file('/root/ide-s/TypeScript-Node-Starter').toString(),
      lastModification: 0,
      isDirectory: true,
      children: tree.map((item) => ({
        uri: Uri.file(`/root/ide-s/TypeScript-Node-Starter/${item.name}`).toString(),
        lastModification: 0,
        isDirectory: item.type === 'tree',
      })),
    };
  }
}
