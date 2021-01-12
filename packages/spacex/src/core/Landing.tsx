import React, { FC } from 'react';
import { RootProps } from './types';
import styles from './style.module.less';

export const Landing: FC<RootProps> = ({ theme, status, errorMessage }) => {
  const logo =
    theme === 'dark'
      ? 'https://gw.alipayobjects.com/mdn/rms_3b03a3/afts/img/A*VYOmT7m_mo4AAAAAAAAAAAAAARQnAQ'
      : 'https://gw.alipayobjects.com/mdn/rms_3b03a3/afts/img/A*3g50R7jRSHEAAAAAAAAAAAAAARQnAQ';
  return (
    <div className={styles.landing}>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      <div className={styles.tip}>
        {status === 'error' ? (
          <span className={styles.error}>{errorMessage}</span>
        ) : (
          <span>正在加载工作空间...</span>
        )}
      </div>
    </div>
  );
};
