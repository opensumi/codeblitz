import * as React from 'react';
import { SCMResourceView as OriginSCMResourceView } from '@ali/ide-scm/lib/browser/scm.view';
import { ViewState } from '@ali/ide-core-browser';

export const SCMResourceView: React.FC<{
  viewState: ViewState;
}> = (props) => {
  const passedProps = {
    ...props,
    viewState: {
      ...props.viewState,
      // 10px 留给间距
      height: props.viewState.height - 10,
    },
  };
  return (
    <div style={{ paddingTop: 10 }}>
      <OriginSCMResourceView {...passedProps} />
    </div>
  );
};
