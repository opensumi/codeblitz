import { useInjectable } from '@opensumi/ide-core-browser';
import { localize } from '@opensumi/ide-core-common';
import { ReactEditorComponent } from '@opensumi/ide-editor/lib/browser';
import React from 'react';
import { AppCommonConfig, AppConfig } from '../../common';

import styles from './welcome.module.less';
export const EditorWelcomeComponent: ReactEditorComponent = () => {
  const appConfig = useInjectable<AppConfig & AppCommonConfig>(AppConfig);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.productName}>{appConfig.app?.productName}</div>
        <div className={styles.productDescription}>{localize('product.description')}</div>
      </div>
    </div>
  );
};
