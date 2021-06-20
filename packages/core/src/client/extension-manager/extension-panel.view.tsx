import * as React from 'react';
import { localize } from '@ali/ide-core-browser';
import { enableExtensionsContainerId, enableExtensionsTarbarHandlerId } from './base';
import { ExtensionEnableAccordion } from './extension-panel-accordion.view';
import * as styles from './extension-panel.module.less';
import { AccordionContainer } from '@ali/ide-main-layout/lib/browser/accordion/accordion.view';

export default () => {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>{localize('marketplace.tab.installed')}</div>
      <AccordionContainer
        views={[
          {
            component: ExtensionEnableAccordion,
            id: enableExtensionsTarbarHandlerId,
            name: localize('marketplace.panel.enabled'),
          },
        ]}
        noRestore={true}
        containerId={enableExtensionsContainerId}
        className={styles.accordion}
      />
    </div>
  );
};
