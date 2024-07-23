import { localize } from '@opensumi/ide-core-browser';
import clx from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { RawExtension } from '../base';
import * as commonStyles from '../common.module.less';
import * as styles from './index.module.less';

interface RawExtensionProps extends React.HTMLAttributes<HTMLDivElement> {
  extension: RawExtension;
  select: (extension: RawExtension, isDouble: boolean) => void;
  showExtraAction?: boolean;
}

export const RawExtensionView: React.FC<RawExtensionProps> = observer(
  ({ extension, select, className, showExtraAction = true }) => {
    const timmer = React.useRef<any>();
    const clickCount = React.useRef(0);

    function handleClick(e) {
      clickCount.current++;
      clearTimeout(timmer.current);
      timmer.current = setTimeout(() => {
        if (clickCount.current === 1) {
          select(extension, false);
        } else if (clickCount.current === 2) {
          select(extension, true);
        }
        clickCount.current = 0;
      }, 200);
    }

    return (
      <div className={className}>
        <div onClick={handleClick} className={clx(styles.wrap, 'kt-extension-raw')}>
          <div>
            <img className={styles.icon} src={extension.icon}></img>
          </div>
          <div className={styles.info_wrap}>
            <div className={styles.info_header}>
              <div className={clx(styles.name_wrapper)}>
                <div className={styles.name}>{extension.displayName || extension.name}</div>
                {extension.isBuiltin
                  ? (
                    <span className={commonStyles.tag}>
                      {localize('marketplace.extension.builtin')}
                    </span>
                  )
                  : null}
                {extension.isDevelopment
                  ? (
                    <span className={clx(commonStyles.tag, commonStyles.developmentMode)}>
                      {localize('marketplace.extension.development')}
                    </span>
                  )
                  : null}
              </div>
            </div>
            <div className={clx(styles.extension_props)}>
              <span>{extension.publisher}</span>
              <span>v{extension.version}</span>
            </div>
            <div className={clx(styles.description, 'kt-extension-raw-description')}>
              {extension.description}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
