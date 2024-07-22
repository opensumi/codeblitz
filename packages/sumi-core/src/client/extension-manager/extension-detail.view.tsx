import { Tabs } from '@opensumi/ide-components';
import { localize, useInjectable } from '@opensumi/ide-core-browser';
import { ReactEditorComponent } from '@opensumi/ide-editor/lib/browser';
import { Markdown } from '@opensumi/ide-markdown';
import clx from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ExtensionDetail, IExtensionManagerService } from './base';
import * as commonStyles from './common.module.less';
import * as styles from './extension-detail.module.less';
import { ExtensionManagerService } from './extension-manager.service';

const tabMap = [
  {
    key: 'readme',
    label: localize('marketplace.extension.readme'),
  },
  {
    key: 'changelog',
    label: localize('marketplace.extension.changelog'),
  },
];

export const ExtensionDetailView: ReactEditorComponent<null> = observer((props) => {
  const { extensionId } = props.resource.uri.getParsedQuery();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [currentExtension, setCurrentExtension] = React.useState<ExtensionDetail | null>(null);
  const extensionManagerService = useInjectable<ExtensionManagerService>(IExtensionManagerService);

  React.useEffect(() => {
    extensionManagerService
      .getDetailById(extensionId)
      .then((ext) => ext && setCurrentExtension(ext));
  }, [extensionId]);

  return (
    <div className={styles.wrap}>
      {currentExtension && (
        <div className={styles.header}>
          <div>
            <img className={styles.icon} src={currentExtension.icon}></img>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>
              <span className={styles.name}>
                {currentExtension.displayName || currentExtension.name}
              </span>
              {currentExtension.isBuiltin
                ? (
                  <span className={commonStyles.tag}>
                    {localize('marketplace.extension.builtin')}
                  </span>
                )
                : null}
              {currentExtension.isDevelopment
                ? (
                  <span className={clx(commonStyles.tag, commonStyles.developmentMode)}>
                    {localize('marketplace.extension.development')}
                  </span>
                )
                : null}
            </div>
            <div className={styles.subtitle}>
              <span className={styles.subtitle_item}>{currentExtension.publisher}</span>
              <span className={styles.subtitle_item}>v{currentExtension.version}</span>
            </div>
            <div className={styles.description}>{currentExtension.description}</div>
          </div>
        </div>
      )}
      {currentExtension && (
        <div className={styles.body}>
          <Tabs
            className={styles.tabs}
            value={tabIndex}
            onChange={(index: number) => setTabIndex(index)}
            tabs={tabMap.map((tab) => tab.label)}
          />
          <div className={styles.content}>
            {tabMap[tabIndex].key === 'readme' && (
              <Markdown
                content={currentExtension.readme
                  ? currentExtension.readme
                  : `# ${currentExtension.displayName}\n${currentExtension.description}`}
              />
            )}
            {tabMap[tabIndex].key === 'changelog' && (
              <Markdown
                content={currentExtension.changelog ? currentExtension.changelog : 'no changelog'}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});
