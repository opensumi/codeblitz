import { Scrollbars } from '@opensumi/ide-components';
import { useInjectable } from '@opensumi/ide-core-browser';
import { ProgressBar } from '@opensumi/ide-core-browser/lib/components/progressbar';
import clx from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { IExtensionManagerService, RawExtension } from '../base';
import { ExtensionManagerService } from '../extension-manager.service';
import { RawExtensionView } from '../raw-extension';
import * as styles from './index.module.less';

export interface ExtensionListProps {
  height?: number;
  loading?: boolean;
  empty?: React.ReactNode | string;
  onReachBottom?: () => void;
  list: RawExtension[];
  showExtraAction?: boolean;
}

export const ExtensionList: React.FC<ExtensionListProps> = observer(
  ({ height, loading = false, list, empty, onReachBottom, showExtraAction = true }) => {
    const [selectExtensionId, setSelectExtensionId] = React.useState('');
    const extensionManagerService = useInjectable<ExtensionManagerService>(IExtensionManagerService);

    function select(extension: RawExtension, isDouble: boolean) {
      setSelectExtensionId(extension.extensionId);
      extensionManagerService.openExtensionDetail({
        publisher: extension.publisher,
        name: extension.name,
        displayName: extension.displayName || extension.name,
        icon: extension.icon,
        preview: !isDouble,
        version: extension.version,
      });
    }

    return (
      <div className={styles.wrap}>
        <ProgressBar loading={loading} />
        {list && list.length
          ? (
            <Scrollbars style={{ height: height ?? 'auto' }} onReachBottom={onReachBottom}>
              <div>
                {list.map((rawExtension, index) => {
                  return (
                    <RawExtensionView
                      className={clx({
                        [styles.selected]: rawExtension.extensionId === selectExtensionId,
                        [styles.last_item]: index === list.length - 1,
                      })}
                      key={`${rawExtension.extensionId}_${rawExtension.version}`}
                      extension={rawExtension}
                      select={select}
                      showExtraAction={showExtraAction}
                    />
                  );
                })}
              </div>
            </Scrollbars>
          )
          : typeof empty === 'string'
          ? <div className={styles.empty}>{empty}</div>
          : empty}
      </div>
    );
  },
);
