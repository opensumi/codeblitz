import React, { FC } from 'react';
import { Landing } from './Landing';
import styles from './style.module.less';
import { RootProps } from './types';

export const Root: FC<RootProps> = (props) => {
  return (
    <div className={`${props.theme} ${styles['workspace-root']}`}>
      {(props.status === 'loading' || props.status === 'error') && <Landing {...props} />}
      {props.children}
    </div>
  );
};
