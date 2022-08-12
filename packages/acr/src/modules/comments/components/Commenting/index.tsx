import React from 'react';
import { observer } from 'mobx-react-lite';
import { IEventBus } from '@opensumi/ide-core-browser';
import { useInjectable } from '@opensumi/ide-core-browser/lib/react-hooks';
import { IAntcodeService } from '../../../antcode-service/base';
import { ICommentsThread, ICommentsZoneWidget } from '@opensumi/ide-comments';
import { EditorType } from '@opensumi/ide-editor';
import { genLineCode } from '../../utils';
import { DiffChangeEvent } from '../../../../common';
import { Portal } from '../../../../portal';

export const Commenting: React.FC<{
  thread: ICommentsThread;
  widget: ICommentsZoneWidget;
}> = observer(({ thread, widget }) => {
  const [updateDiffFlag, setUpdateDiffFlag] = React.useState(false);
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);
  const eventBus = useInjectable<IEventBus>(IEventBus);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const path = React.useMemo(() => {
    const p = thread.uri.path.toString();
    return p.startsWith('/') ? p.slice(1) : p;
  }, [thread]);

  const AntCodeCommenting = React.useMemo(() => {
    return antcodeService.Commenting;
  }, []);

  const change = React.useMemo(() => {
    const editorType = widget.coreEditor.getType();
    return antcodeService.pullRequestChangeList.find((change) => {
      const changePath = editorType === EditorType.ORIGINAL_DIFF ? change.oldPath : change.newPath;
      return changePath === path;
    });
  }, [antcodeService, path, updateDiffFlag]);

  const lineCode = React.useMemo(() => {
    const line = thread.range.startLineNumber;
    const editorType = widget.coreEditor.getType();
    // @ts-ignore
    if (change.diff) {
      return genLineCode(
        // @ts-ignore
        change.diff,
        path,
        line,
        editorType === EditorType.ORIGINAL_DIFF
      );
    } else {
      // 说明还未获取到 diff 信息，先返回空字符串
      return '';
    }
  }, [thread, widget, change, updateDiffFlag]);

  React.useEffect(() => {
    eventBus.once(DiffChangeEvent, (e) => {
      // @ts-ignore
      if (e.payload.newPath === change.newPath) {
        setUpdateDiffFlag(true);
      }
    });
  }, []);

  const effect: Parameters<typeof React.useEffect> = [
    () => {
      // zone widget show/dispose 后 焦点会在 body 上，新增评论时需要手动的设置下 focus
      const textarea = inputRef?.current;

      const disposer = widget.onFirstDisplay(() => {
        // 需要加一个定时器，否则会影响 zone widget 的定位
        setTimeout(() => {
          widget.coreEditor.monacoEditor.revealLine(thread.range.startLineNumber + 1);
        }, 0);
        // 需要加一个定时器，否则 preventScroll 可能不会工作
        // https://stackoverflow.com/questions/54580427/focuspreventscroll-true-not-working-in-chrome
        setTimeout(() => {
          textarea &&
            textarea.focus({
              preventScroll: true,
            });
        }, 100);
      });

      return () => {
        disposer.dispose();
      };
    },
    [],
  ];

  const onCloseThread = React.useCallback(() => {
    // TODO： Gitlink 评论 dispose 后白色区域仍然存在，临时先在这里加个 setTimeout
    setTimeout(() => {
      thread.dispose();
    });
  }, [thread]);

  return (
    <Portal
      effect={effect}
      component={AntCodeCommenting}
      componentProps={{
        lineCode,
        onClose: onCloseThread,
        path,
        inputRef,
      }}
    />
  );
});
