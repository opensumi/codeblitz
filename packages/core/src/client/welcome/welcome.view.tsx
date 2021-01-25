import React from 'react';
import { localize } from '@ali/ide-core-common';
import { ReactEditorComponent } from '@ali/ide-editor/lib/browser';
import styles from './welcome.module.less';
import { CommonConfig } from '../../common/config';

export const EditorWelcomeComponent: ReactEditorComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.productName}>{CommonConfig.productName}</div>
        <div className={styles.productDescription}>{localize('product.description')}</div>
      </div>
    </div>
  );
};
