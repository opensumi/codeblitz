import React, { FC } from 'react';
import { Landing } from './Landing';
import { RootProps } from './types';
import { themeStorage } from './utils';

export const Root: FC<RootProps> = (props) => {
  const themeType = props.theme;
  const LandingComponent = props.Landing!;

  // TODO: 可以获取挂载元素的 Rect 来设置宽高
  return (
    <div
      className={`alex-root ${themeType ? `alex-${themeType}` : ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      {(props.status === 'loading' || props.status === 'error') && <LandingComponent {...props} />}
      {props.children}
    </div>
  );
};

Root.defaultProps = {
  Landing,
};
