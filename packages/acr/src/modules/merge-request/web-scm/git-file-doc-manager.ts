import { Autowired, Injectable } from '@opensumi/di';
import { URI } from '@opensumi/ide-core-browser';

import { WorkbenchEditorService, IResourceOpenOptions } from '@opensumi/ide-editor';
import { WorkbenchEditorServiceImpl } from '@opensumi/ide-editor/lib/browser/workbench-editor.service';
import { ensureDir } from '@opensumi/ide-core-common/lib/browser-fs/ensure-dir';
import * as paths from '@opensumi/ide-core-common/lib/path';
import { promisify } from '@opensumi/ide-core-common/lib/browser-fs/util';

/**
 * 目前尚未开始使用
 * 管理打开过的文件和编辑过的文件
 * 处理其内容初始化和文件销毁 (切换 ref 时)
 */
@Injectable()
export class GitFileDocManager {
  private _openedFiles = new Set<string>();

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorServiceImpl;

  async openFile(Uri: URI, defaultContent = {}) {
    const targetFileUri = Uri;

    // FIXME: 这里不能做打开时直接复制文件内容，只有在文件不存在的时候才可以写入内容
    // {workspaceDir}/{ref}/{path}
    await ensureDir(targetFileUri.path.dir.toString());

    // const content = docRef.instance.getText();
    // // get content by document content manager
    // await promisify(fs.writeFile)(targetFileUri.codeUri.fsPath.toString(), content);
    // await this.workbenchEditorService.open(targetFileUri);
  }
}
