import React, { FC } from 'react';
import { Landing } from './Landing';
import { RootProps } from './types';

export const Root: FC<RootProps> = (props) => {
  const LandingComponent = props.Landing!;
  return (
    <div id="alex-app-root">
      {(props.status === 'loading' || props.status === 'error') && <LandingComponent {...props} />}
      {props.children}
    </div>
  );
};

Root.defaultProps = {
  Landing,
};
