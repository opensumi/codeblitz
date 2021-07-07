/**
 * web scm provider 所有的 provider/group/resource 定义都在这里
 */
import { Autowired, Injectable, Optional } from '@ali/common-di';
import { URI, Uri, Event, Emitter } from '@ali/ide-core-common';
import { Sequence, ISplice } from '@ali/ide-core-common/lib/sequence';
import { ISCMProvider, ISCMResourceGroup, ISCMResource, VSCommand } from '@ali/ide-scm';
import { toGitUri, toDiffUri } from '../changes-tree/util';
import { WorkbenchEditorService } from '@ali/ide-editor';
import { WorkspaceManagerService } from '../../workspace/workspace-loader.service';

@Injectable({ multiple: true })
export class WebSCMProvider implements ISCMProvider {
  public groups = new Sequence<ISCMResourceGroup>();

  private _label: string;
  private _id: string;
  private _contextValue: string;

  public rootUri: Uri | undefined;

  @Autowired()
  private readonly workspaceManagerService: WorkspaceManagerService;

  constructor(
    @Optional() id: number,
    @Optional() scheme = 'web_scm',
    @Optional() rootUri = Uri.file('/test/workspace')
  ) {
    this._label = 'scm_label_' + id;
    this._id = 'scm_id_' + id;
    this._contextValue = scheme;
    this.rootUri = rootUri;
  }

  get label() {
    return this._label;
  }
  get id() {
    return this._id;
  }
  get contextValue() {
    return this._contextValue;
  }

  public count: number;
  public statusBarCommands: VSCommand[] | undefined = [];

  public onDidChangeStatusBarCommandsEmitter = new Emitter<VSCommand[]>();
  readonly onDidChangeStatusBarCommands: Event<VSCommand[]> = this
    .onDidChangeStatusBarCommandsEmitter.event;

  public onDidChangeEmitter = new Emitter<void>();
  readonly onDidChange: Event<void> = this.onDidChangeEmitter.event;

  public onDidChangeResourcesEmitter = new Emitter<void>();
  readonly onDidChangeResources: Event<void> = this.onDidChangeResourcesEmitter.event;

  async getOriginalResource(uri: Uri): Promise<Uri | null> {
    const rootURI = new URI(this.rootUri);
    const fileUri = new URI(uri);
    if (rootURI.isEqualOrParent(fileUri)) {
      const params = await this.workspaceManagerService.getParsedUriParams(fileUri);
      if (!params) {
        return null;
      }
      const { ref, path } = params;
      const codeUri = toGitUri(new URI(path), ref).codeUri;
      return codeUri;
    }
    return null;
  }

  toJSON() {
    return { $mid: 5 };
  }

  registerGroup(group: ISCMResourceGroup) {
    this.groups.splice(this.groups.elements.length, 0, [group]);
  }

  dispose() {}
}

export class WebSCMResourceGroup implements ISCMResourceGroup {
  readonly provider: ISCMProvider;

  private _hideWhenEmpty = false;
  public elements: ISCMResource[] = [];

  private _onDidSplice = new Emitter<ISplice<ISCMResource>>();
  readonly onDidSplice = this._onDidSplice.event;

  get hideWhenEmpty(): boolean {
    return !!this._hideWhenEmpty;
  }

  private _onDidChange = new Emitter<void>();
  readonly onDidChange: Event<void> = this._onDidChange.event;

  constructor(provider: ISCMProvider, public label: string, public id: string) {
    this.provider = provider;
  }

  splice(start: number, deleteCount: number, toInsert: ISCMResource[]) {
    this.elements.splice(start, deleteCount, ...toInsert);
    this._onDidSplice.fire({ start, deleteCount, toInsert });
  }

  updateHideWhenEmpty(updater: boolean): void {
    this._hideWhenEmpty = updater;
    this._onDidChange.fire();
  }

  toJSON() {
    return { $mid: 4 };
  }
}

@Injectable({ multiple: true })
export class WebSCMResource implements ISCMResource {
  contextValue: undefined;
  command: undefined;
  private _resourceGroup: ISCMResourceGroup;
  readonly sourceUri: Uri;
  readonly decorations = {
    // 默认全部都是修改文件
    letter: 'M',
    color: 'kt.decoration.modifiedResourceForeground',
  };

  get resourceGroup() {
    return this._resourceGroup;
  }

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired()
  private readonly workspaceManagerService: WorkspaceManagerService;

  constructor(@Optional() resourceGroup: ISCMResourceGroup, @Optional() private fsPath?: string) {
    this._resourceGroup = resourceGroup;
    if (fsPath) {
      this.sourceUri = Uri.file(fsPath);
    }
  }

  async open() {
    // 前提: 在 antcode cr 场景下，只能编辑文件，不能新建
    const rightUri = URI.file(this.fsPath!);
    const params = await this.workspaceManagerService.getParsedUriParams(rightUri);

    if (!params) {
      return;
    }

    const { path, ref } = params;
    const leftUri = toGitUri(new URI(path), ref);
    await this.workbenchEditorService.open(toDiffUri(leftUri, rightUri));
  }

  toJSON() {
    return { $mid: 3 };
  }
}
