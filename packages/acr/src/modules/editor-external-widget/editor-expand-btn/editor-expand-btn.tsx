import * as React from 'react';
import { useInjectable, SlotLocation } from '@ali/ide-core-browser';
import { Icon } from '@ali/ide-core-browser/lib/components';
import { IMainLayoutService } from '@ali/ide-main-layout';

import * as styles from './styles.module.less';

export const ExpandBtn: React.FC = () => {
  const layoutService = useInjectable<IMainLayoutService>(IMainLayoutService);
  const lastSize = React.useRef<number>();

  const [isLeftPanelVisible, setLeftPanelVisible] = React.useState<boolean>(() => {
    const tabbarService = layoutService.getTabbarService(SlotLocation.left);
    return Boolean(tabbarService && !tabbarService.currentContainerId);
  });

  const handleToggle = () => {
    const tabbarService = layoutService.getTabbarService(SlotLocation.left);
    if (!tabbarService) {
      return;
    }

    // 本解决方案仅限于解决当前场景
    // 仅模拟左侧 activity-bar 的图标点击
    // if (tabbarService.currentContainerId) {
    //   tabbarService.currentContainerId = '';
    //   // 将当前 currentContainerId 值缓存下来
    //   lastContainerId.current = tabbarService.currentContainerId
    // } else {
    //   tabbarService.currentContainerId = lastContainerId.current;
    // }

    // currentContainerId 决定当前 slot left 是否可见
    const nextValue = !tabbarService.currentContainerId;
    if (nextValue === false) {
      // 将当前 size 值缓存下来
      lastSize.current = tabbarService.resizeHandle.getSize();
      layoutService.toggleSlot(SlotLocation.left, false, 0);
    } else {
      layoutService.toggleSlot(SlotLocation.left, true, lastSize.current);
    }
    setLeftPanelVisible(nextValue);
  };

  return (
    <div className={styles.expander} onClick={handleToggle}>
      <Icon className={styles.icon} icon={isLeftPanelVisible ? 'left' : 'right'} />
    </div>
  );
};
