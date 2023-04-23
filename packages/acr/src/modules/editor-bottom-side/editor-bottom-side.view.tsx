import React from 'react';
import { ReactEditorComponent } from '@opensumi/ide-editor/lib/browser';
import { Button } from '@opensumi/ide-components';

import * as style from './editor-bottom-side.module.less';
import { LeftOutlined, RightOutlined, WarningTwoTone } from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style';
import {
  localize,
  formatLocalize,
  useInjectable,
  CommandService,
  useUpdateOnEvent,
} from '@opensumi/ide-core-browser';
import { IAntcodeService, IPullRequestChangeDiff } from '../antcode-service/base';
import { GOTO_PREVIOUS_CHANGE, GOTO_NEXT_CHANGE } from '../merge-request/common';
import { observer } from 'mobx-react-lite';
import { AnnotationService } from '../comments/annotation.service';

export const ViewedCheckbox: React.FC<{
  change: IPullRequestChangeDiff;
  onChangeViewed: (viewed: boolean) => void;
}> = observer(({ change, onChangeViewed }) => {
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);
  const isViewed = antcodeService.isViewedChange(change);

  useUpdateOnEvent(antcodeService.onDidViewChange, []);
  return (
    <Checkbox
      className={style.as_read}
      checked={isViewed}
      onChange={(e) => onChangeViewed(e.target.checked)}
    >
      {localize('misc.viewed')}({antcodeService.viewedChangeFileSize}/
      {antcodeService.changeFileSize})
    </Checkbox>
  );
});

export const EditorBottomSideWidget: ReactEditorComponent<any> = observer(({ resource }) => {
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);
  const commandService = useInjectable<CommandService>(CommandService);
  const annotationService = useInjectable<AnnotationService>(AnnotationService);
  const change = antcodeService.getChangeByUri(resource.uri);
  const annotationCount = annotationService.getAnnotationCountByUri(resource.uri);

  const onChangeViewed = React.useCallback(() => {
    antcodeService.toggleFileViewed(resource.uri);
  }, [resource]);

  const gotoPreviousChangeFile = React.useCallback(() => {
    commandService.executeCommand(GOTO_PREVIOUS_CHANGE, 'editor-bottom-side');
  }, []);

  const gotoNextChangeFile = React.useCallback(() => {
    commandService.executeCommand(GOTO_NEXT_CHANGE, 'editor-bottom-side');
  }, []);

  return (
    <div className={style.container}>
      <div>
        {annotationCount > 0 && (
          <span className={style.annotation}>
            <WarningTwoTone className={style.annotation_icon} /> {annotationCount}
          </span>
        )}
        {change && (
          <>
            {change!.addLineNum! > 0 && (
              <span className={style.add_line_num}>+{change.addLineNum}</span>
            )}
            {change!.delLineNum! > 0 && (
              <span className={style.del_line_num}>-{change.delLineNum}</span>
            )}
          </>
        )}
      </div>
      <div className={style.as_read}>
        <span className={style.item_desc}>
          {formatLocalize('editor-bottom-side.markAsRead', 'Alt+C')}， &nbsp;
          {formatLocalize('editor-bottom-side.switchChangeFile', 'Alt+↑/↓')}
        </span>
        {change && antcodeService.isDiffOverview && (
          <ViewedCheckbox change={change} onChangeViewed={onChangeViewed} />
        )}
        <span className={style.btns}>
          <Button>
            <LeftOutlined />
            <span className={style.btn} onClick={gotoPreviousChangeFile}>
              上一个文件
            </span>
          </Button>
          <Button style={{ marginLeft: 8 }}>
            <span className={style.btn} onClick={gotoNextChangeFile}>
              下一个文件
            </span>
            <RightOutlined />
          </Button>
        </span>
      </div>
    </div>
  );
});
