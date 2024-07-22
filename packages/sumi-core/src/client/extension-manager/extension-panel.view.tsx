import { localize } from '@opensumi/ide-core-browser';
import { AccordionContainer } from '@opensumi/ide-main-layout/lib/browser/accordion/accordion.view';
import * as React from 'react';
import { enableExtensionsContainerId, enableExtensionsTarbarHandlerId } from './base';
import { ExtensionEnableAccordion } from './extension-panel-accordion.view';
import * as styles from './extension-panel.module.less';

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
