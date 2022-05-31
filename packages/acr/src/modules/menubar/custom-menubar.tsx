import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from '@opensumi/ide-components';
import {
  useInjectable,
  IPreferenceSettingsService,
  PreferenceScope,
} from '@opensumi/ide-core-browser';
import { localize } from '@opensumi/ide-core-common';

import { Popover, Radio, Switch } from 'antd';

import { IAntcodeService } from '../antcode-service/base';

import * as styles from './styles.module.less';
import { Portal } from '../../portal';

const SettingMenu: React.FC<{
  afterClick: () => void;
}> = (props) => {
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);
  const preferenceService = useInjectable<IPreferenceSettingsService>(IPreferenceSettingsService);

  const [formData, dispatch] = React.useReducer(
    (state, action) => {
      // case 'editor.wordWrap':
      switch (action.type) {
        case 'editor.fontSize':
        case 'acr.lsifEnabled':
        case 'acr.foldingEnabled':
          return { ...state, [action.type]: action.value };
      }
    },
    {},
    () => {
      return [
        'editor.fontSize',
        // 'diffEditor.renderSideBySide',
        'acr.lsifEnabled',
        'acr.foldingEnabled',
        // 'editor.wordWrap',
      ].reduce((prev, key) => {
        const value = preferenceService.getPreference(key, PreferenceScope.User);
        prev[key] = value.value;
        return prev;
      }, {});
    }
  );

  const handleChange = React.useCallback((key: string, value: any) => {
    preferenceService.setPreference(key, value, PreferenceScope.User);
    dispatch({
      type: key,
      value,
    });
    props.afterClick();
  }, []);

  return (
    <div className={styles.settingMenu}>
      <div className={styles.settingTitle}>{localize('acr.settings.readingGroup')}</div>
      {/* 主题模式：
      <Radio.Group>
        <Radio value={1}>浅色模式</Radio>
        <Radio value={2}>深色模式</Radio>
      </Radio.Group> */}
      <div className={styles.settingRow}>
        {localize('acr.settings.fontSize')}:&nbsp;
        <Radio.Group
          value={formData['editor.fontSize']}
          onChange={(e) => handleChange('editor.fontSize', e.target.value)}
        >
          <Radio value={10}>{localize('acr.settings.fontSize.small')}</Radio>
          <Radio value={13}>{localize('acr.settings.fontSize.medium')}</Radio>
          <Radio value={16}>{localize('acr.settings.fontSize.large')}</Radio>
        </Radio.Group>
      </div>

      {/* <div className={styles.settingRow}>
        {localize('acr.settings.readingMode')}：
        <Radio.Group
          value={formData['diffEditor.renderSideBySide']}
          onChange={(e) =>
            handleChange('diffEditor.renderSideBySide', e.target.value)
          }
        >
          <Radio value={false}>
            {localize('acr.settings.readingMode.inline')}
          </Radio>
          <Radio value={true}>
            {localize('acr.settings.readingMode.sideBySide')}
          </Radio>
        </Radio.Group>
      </div> */}

      <div className={styles.settingRow}>
        {localize('acr.settings.lsif')}：
        <Switch
          checkedChildren={localize('acr.common.on')}
          unCheckedChildren={localize('acr.common.off')}
          checked={formData['acr.lsifEnabled']}
          onChange={(checked) => handleChange('acr.lsifEnabled', checked)}
        />
      </div>

      <div className={styles.settingRow}>
        {localize('acr.settings.folding')}：
        <Switch
          checkedChildren={localize('acr.common.on')}
          unCheckedChildren={localize('acr.common.off')}
          checked={formData['acr.foldingEnabled']}
          onChange={(checked) => handleChange('acr.foldingEnabled', checked)}
        />
      </div>

      {/* <div className={styles.settingRow}>
        {localize('acr.settings.editorWordWrap')}：
        <Switch
          checkedChildren={localize('acr.common.on')}
          unCheckedChildren={localize('acr.common.off')}
          checked={formData['editor.wordWrap']}
          onChange={(checked) => handleChange('editor.wordWrap', checked)}
        />
      </div> */}

      <div className={styles.settingTitle} style={{ marginTop: 16 }}>
        {localize('acr.settings.otherGroup')}
      </div>

      {antcodeService.PRMoreActionLinks && (
        <div
          onClick={() => {
            props.afterClick();
          }}
        >
          <Portal
            component={antcodeService.PRMoreActionLinks}
            componentProps={{ setVisible: () => {} }}
          />
        </div>
      )}
    </div>
  );
};

export const CustomMenubar = observer(() => {
  // 全屏功能
  // const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  // const handleClick = async () => {
  //   await document.querySelector('#antcode-cr').requestFullscreen();
  //   setFullScreen((r) => !r);
  // };

  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);
  const [settingsVisible, updateSettingsVisible] = React.useState(false);

  return (
    <div className={styles.menubar}>
      <div className={styles.element}>
        {antcodeService.Menubar && <Portal component={antcodeService.Menubar} />}
      </div>
      <Popover
        content={
          <SettingMenu
            afterClick={() => {
              updateSettingsVisible(false);
            }}
          />
        }
        title={null}
        trigger="click"
        placement="bottomRight"
        arrowPointAtCenter
        visible={settingsVisible}
        onVisibleChange={(visible: boolean) => {
          if (visible) {
            updateSettingsVisible(visible);
          } else {
            // 因为 PRMoreActionLinks 采用 Portal 渲染，导致 Popup 认为为 outside，所以会主动关闭
            // Popup 使用的是 mousedown，为了触发 a 的 click 事件，延迟关闭，否则 a 的 click 无法响应
            // delay 需 >= 120ms，参照 fastclick https://github.com/ftlabs/fastclick/blob/master/lib/fastclick.js#L574
            setTimeout(() => {
              updateSettingsVisible(visible);
            }, 120);
          }
        }}
      >
        <Icon icon="setting" />
      </Popover>
    </div>
  );
});
