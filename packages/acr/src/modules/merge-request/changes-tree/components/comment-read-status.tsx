import * as React from 'react';
import { Icon } from '@ali/ide-core-browser/lib/components';
import { observer } from 'mobx-react-lite';

import { IPullRequestChangeOverview } from '../../../../common';
import { IAntcodeService } from '../../../antcode-service/base';
import { useInjectable, useUpdateOnEvent } from '@ali/ide-core-browser';

export const CommentReadBadge: React.FC<{
  change: IPullRequestChangeOverview;
  className?: string;
}> = observer((props) => {
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);
  const isViewed = antcodeService.isViewedChange(props.change);

  useUpdateOnEvent(
    antcodeService.onDidViewChange,
    [],
    (newPath) => props.change.newPath === newPath
  );

  if (isViewed) {
    return <Icon className={props.className} icon="check" />;
  }
  return null;
});
