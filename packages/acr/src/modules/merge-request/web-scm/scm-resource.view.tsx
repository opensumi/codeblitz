import * as React from 'react';
import { SCMResourcesViewWrapper } from '@opensumi/ide-scm/lib/browser/scm-view-container';
import { ViewState } from '@opensumi/ide-core-browser';

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
      <SCMResourcesViewWrapper {...passedProps} />
    </div>
  );
};
