import { Autowired, Injectable, INJECTOR_TOKEN, Injector } from '@opensumi/di';
import {
  localize,
  EDITOR_COMMANDS,
  QuickOpenItem,
  CommandService,
  QuickOpenItemOptions,
  QuickOpenMode,
  URI,
  formatLocalize,
} from '@opensumi/ide-core-browser';
import { LabelService } from '@opensumi/ide-core-browser/lib/services';
import { QuickOpenHandler } from '@opensumi/ide-quick-open/lib/browser/prefix-quick-open.service';
import { QuickOpenModel } from '@opensumi/ide-quick-open';
import { basename } from '@opensumi/ide-core-common/lib/path';
import { OpenChangeFilesService } from './open-change-files';

import { IAntcodeService } from './antcode-service/base';
import type { IPullRequestChangeDiff } from './antcode-service/base';

@Injectable({ multiple: true })
export class ChangeFileQuickOpenItem extends QuickOpenItem {
  constructor(
    protected readonly changeFile: IPullRequestChangeDiff,
    readonly changeFileOpts: QuickOpenItemOptions
  ) {
    super(changeFileOpts);
  }

  @Autowired()
  private readonly labelService: LabelService;

  @Autowired()
  private readonly openChangeFilesService: OpenChangeFilesService;

  getLabel(): string {
    return basename(this.changeFile.newPath);
  }

  getDetail(): string | undefined {
    // 目前 quick-open 会将这个选项进行 trim，且在 monaco-editor 内部实现
    // 因此这里使用 magic invisible unicode 完成缩进的处理
    return '\u2000\u2000\u2000\u2000' + this.changeFile.newPath;
  }

  getTooltip() {
    return this.changeFile.newPath;
  }

  getIconClass() {
    return this.labelService.getIcon(new URI(this.changeFile.newPath));
  }

  // @ts-ignore
  getGroupLabel() {
    // https://code.alipay.com/linkcode/antcode/blob/64321ed026d3f9e3f547f8c6cde2aef391b41a11/src/next/components/change-size-label.tsx#L28
    // code 侧还处理了 binaryFile 的 size 做展示，但需要额外请求接口
    const { addLineNum, delLineNum } = this.changeFile;
    if (addLineNum === undefined || delLineNum === undefined) {
      return null;
    }
    return formatLocalize('misc.quick-open.changes_desc', addLineNum, delLineNum);
  }

  run(mode: QuickOpenMode): boolean {
    if (mode !== QuickOpenMode.OPEN) {
      return false;
    }

    this.openChangeFilesService.openFile(this.changeFile, 'quick-open');

    return true;
  }
}

@Injectable()
export class QuickChangeFileHandler implements QuickOpenHandler {
  public default = true;
  public prefix = '';
  public description = localize('quickopen.command.description');

  @Autowired(CommandService)
  private readonly commandService: CommandService;

  @Autowired(IAntcodeService)
  private readonly antcodeService: IAntcodeService;

  @Autowired(INJECTOR_TOKEN)
  private readonly injector: Injector;

  private items: QuickOpenItem[];

  // 每次打开命令面板后会触发一次
  async init() {
    this.items = this.getItems();
  }

  getModel(): QuickOpenModel {
    return {
      onType: (lookFor: string, acceptor: (items: QuickOpenItem[]) => void) => {
        acceptor(this.items);
      },
    };
  }

  getOptions() {
    return {
      placeholder: localize('codereview.quickpick.placeholder'),
      fuzzyMatchLabel: {
        enableSeparateSubstringMatching: true,
      },
      fuzzyMatchDetail: {
        enableSeparateSubstringMatching: true,
      },
      // 关闭模糊排序，否则会按照 label 长度排序
      // 按照 CommandRegistry 默认排序
      fuzzySort: false,
    };
  }

  onClose() {
    this.commandService.executeCommand(EDITOR_COMMANDS.FOCUS.id);
  }

  private getItems() {
    const items: QuickOpenItem[] = [];
    const { pullRequestChangeList } = this.antcodeService;

    items.push(
      ...pullRequestChangeList.map((changeFile) => {
        return this.injector.get(ChangeFileQuickOpenItem, [
          changeFile,
          {
            showBorder: false,
          },
        ]) as unknown as QuickOpenItem;
      })
    );

    return items;
  }
}
