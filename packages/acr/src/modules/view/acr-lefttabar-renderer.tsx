import * as React from 'react';
import { useState, useEffect } from 'react';

import clsx from 'classnames';
import { TabbarConfig } from '@ali/ide-main-layout/lib/browser/tabbar/renderer.view';

// import  styles from '@ali/ide-main-layout/lib/browser/tabbar/styles.module.less';
import styles from './slot-render.module.less';

import {
  ComponentRegistryInfo,
  useInjectable,
  PreferenceService,
  Disposable,
  KeybindingRegistry,
} from '@ali/ide-core-browser';
import {
  TabbarServiceFactory,
  TabbarService,
} from '@ali/ide-main-layout/lib/browser/tabbar/tabbar.service';
import { Badge, Icon } from '@ali/ide-components';
import { observer } from 'mobx-react-lite';
import { IProgressService } from '@ali/ide-core-browser/lib/progress';

function usePreference<T>(key: string, defaultValue: T) {
  const preferenceService: PreferenceService = useInjectable(PreferenceService);
  const [value, setValue] = useState<T>(
    preferenceService.get<T>(key, defaultValue) ?? defaultValue
  );

  useEffect(() => {
    const disposer = new Disposable(
      preferenceService.onSpecificPreferenceChange(key, (change) => {
        setValue(change.newValue);
      })
    );
    return () => {
      disposer.dispose();
    };
  }, []);
  return value;
}

function splitVisibleTabs(
  containers: ComponentRegistryInfo[],
  tabSize: number,
  availableSize: number
) {
  const visibleCount = Math.floor(availableSize / tabSize);
  if (visibleCount >= containers.length) {
    return [containers, []];
  }
  if (visibleCount <= 1) {
    return [[], containers];
  }
  return [containers.slice(0, visibleCount - 1), containers.slice(visibleCount - 1)];
}
const TabbarViewBase: React.FC<{
  TabView: React.FC<{ component: ComponentRegistryInfo }>;
  forbidCollapse?: boolean;
  // tabbar的尺寸（横向为宽，纵向高），tab折叠后为改尺寸加上panelBorderSize
  barSize?: number;
  // 包含tab的内外边距的总尺寸，用于控制溢出隐藏逻辑
  tabSize: number;
  MoreTabView: React.FC;
  panelBorderSize?: number;
  tabClassName?: string;
  className?: string;
  // tab上预留的位置，用来控制tab过多的显示效果
  margin?: number;
}> = observer(
  ({
    TabView,
    MoreTabView,
    forbidCollapse,
    barSize = 48,
    panelBorderSize = 0,
    tabClassName,
    className,
    margin,
    tabSize,
  }) => {
    const { side, direction, fullSize } = React.useContext(TabbarConfig);
    const tabbarService: TabbarService = useInjectable(TabbarServiceFactory)(side);

    React.useEffect(() => {
      // 内部只关注总的宽度
      tabbarService.barSize = barSize + panelBorderSize;
    }, []);
    const { currentContainerId, handleTabClick } = tabbarService;

    const disableTabBar = usePreference<boolean>('workbench.hideSlotTabBarWhenHidePanel', false);

    if (disableTabBar && !currentContainerId) {
      // 之所以要用这么偏门的方法，是因为：
      // 我尝试了好几种方案，比如让 tabbar 或其他几个组件返回 null 的话
      // 会导致 SplitPanel 计算 children 的尺寸不正确，或者计算 tabbar 上按钮区域长度不对等等
      // 最后试了这个方法一劳永逸，感觉也挺合适
      tabbarService.resizeHandle?.setSize(0);
    }

    const [visibleContainers] = splitVisibleTabs(
      tabbarService.visibleContainers.filter((container) => !container.options?.hideTab),
      tabSize,
      fullSize - (margin || 0)
    );
    return (
      <div className={clsx([styles.tab_bar, className])}>
        <div className={styles.bar_content}>
          {visibleContainers.map((component) => {
            const containerId = component.options!.containerId;
            tabbarService.updateTabInMoreKey(containerId, false);
            let ref: HTMLLIElement | null;
            return (
              <li
                key={containerId}
                id={containerId}
                onClick={(e) => handleTabClick(e, forbidCollapse)}
                ref={(el) => (ref = el)}
                className={clsx({ active: currentContainerId === containerId }, tabClassName)}
              >
                <TabView component={component} />
              </li>
            );
          })}
        </div>
      </div>
    );
  }
);

const IconTabView: React.FC<{ component: ComponentRegistryInfo }> = observer(({ component }) => {
  const progressService: IProgressService = useInjectable(IProgressService);
  const keybindingRegistry: KeybindingRegistry = useInjectable(KeybindingRegistry);
  const inProgress = progressService.getIndicator(component.options!.containerId)!.progressModel
    .show;

  return (
    <div className={styles.icon_tab}>
      <div
        className={clsx(component.options!.iconClass, 'activity-icon')}
        title={component.options?.title}
      ></div>
      {inProgress ? (
        <Badge className={styles.tab_badge}>
          <span className={styles.icon_wrapper}>
            <Icon icon="time-circle" />
          </span>
        </Badge>
      ) : (
        component.options!.badge && (
          <Badge className={styles.tab_badge}>{component.options!.badge}</Badge>
        )
      )}
    </div>
  );
});

export const AcrLeftTabbarRenderer: React.FC = () => {
  return (
    <div className={styles.left_tab_bar}>
      <TabbarViewBase
        tabSize={48}
        MoreTabView={() => null}
        className={styles.left_tab_content}
        tabClassName={styles.kt_left_tab}
        TabView={IconTabView}
        barSize={48}
        margin={90}
        panelBorderSize={1}
      />
    </div>
  );
};
