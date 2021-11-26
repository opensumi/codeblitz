import { Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';

import { CommentsContribution } from './comments/comments.contribution';
import { MenubarContribution } from './menubar/menubar.contribution';
import { MiscContribution } from './misc.contribution';
import { StaticResourceContribution } from './static-resource.contribution';
import { QuickChangeFileContribution } from './quickopen.contribution';
import { bindAntCodePreference } from './preferences';
import { DiffFoldingContribution } from './diff-folding/diff-folding.contribution';
import { AntcodeService } from './antcode-service';
import { IAntcodeService } from './antcode-service/base';
import { EditorBottomSideContribution } from './editor-bottom-side/editor-bottom-side.contribution';
import { ChangesTreeLocationContribution } from './merge-request/changes-tree/changes-tree-location.contribution';
import { CustomLeftSlotRenderContribution } from './view/slot-render.contribution';
import { ChangeFileViewedContribution } from './change-file-viewed.contribution';

import { EditorEmptyContribution } from './edtior-empty/index.contribution';
import { EditorExpandBtnContribution } from './editor-external-widget/editor-expand-btn/editor-expand-btn.contribution';
import { EditorTitleMenuContribution } from './editor-external-widget/editor-title-menu/editor-title-menu.contribution';

// 杂七杂八的 service/contribution 放到一起
@Injectable()
export class MiscModule extends BrowserModule {
  preferences = bindAntCodePreference;

  providers = [
    {
      token: IAntcodeService,
      useClass: AntcodeService,
    },
    CommentsContribution,
    MenubarContribution,
    MiscContribution,
    StaticResourceContribution,
    QuickChangeFileContribution,
    /* --- editor related starts --- */
    EditorBottomSideContribution,
    EditorExpandBtnContribution,
    EditorTitleMenuContribution,
    /* --- editor related ends --- */
    ChangesTreeLocationContribution,
    CustomLeftSlotRenderContribution,
    ChangeFileViewedContribution,
    EditorEmptyContribution,
    // experimental
    DiffFoldingContribution,
  ];
}
