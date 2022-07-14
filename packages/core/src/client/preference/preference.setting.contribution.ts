import { SettingContribution, PreferenceSettingId } from '@opensumi/ide-preferences';
import { Domain, ISettingGroup } from '@opensumi/ide-core-browser';

@Domain(SettingContribution)
export class PreferenceSettingContribution implements SettingContribution {
  // 移除默认终端首选项
  handleSettingGroup(settingGroup: ISettingGroup[]) {
    return settingGroup.filter((group) => {
      return group.id !== PreferenceSettingId.Terminal;
    });
  }
}
