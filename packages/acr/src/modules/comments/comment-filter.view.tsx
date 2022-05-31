import React from 'react';
import { localize, useInjectable } from '@opensumi/ide-core-browser';
import { Select } from '@opensumi/ide-components';
import { AntcodeCommentsService } from './comments.service';
import { COMMENT_FILTER_TYPE } from './index';

export const CommentFilter = () => {
  const options = React.useMemo(
    () => [
      {
        label: localize('codereview.comment.allComment'),
        value: COMMENT_FILTER_TYPE.ALL,
      },
      // {
      //   label: localize('codereview.comment.prContentRelatedComment'),
      //   value: COMMENT_FILTER_TYPE.CHANGE_LINE_RELATED,
      // },
      {
        label: localize('codereview.comment.problemComment'),
        value: COMMENT_FILTER_TYPE.PROBLEM,
      },
      {
        label: localize('codereview.comment.hideComment'),
        value: COMMENT_FILTER_TYPE.HIDE,
      },
    ],
    []
  );
  const [type, setType] = React.useState(options[0].label);
  const antCodeCommentsService = useInjectable<AntcodeCommentsService>(AntcodeCommentsService);

  const onChange = React.useCallback((value) => {
    setType(value);
    antCodeCommentsService.commentFilterType = value;
  }, []);

  return <Select options={options} value={type} onChange={onChange} />;
};
