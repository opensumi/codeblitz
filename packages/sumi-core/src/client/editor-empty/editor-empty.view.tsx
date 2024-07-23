import { KeybindingRegistry } from '@opensumi/ide-core-browser';
import { localize, useInjectable } from '@opensumi/ide-core-browser';
import React from 'react';
import { AppCommonConfig, AppConfig } from '../../common';

import styles from './editor-empty.module.less';

export const EditorEmptyComponent: React.FC = () => {
  const keybindingRegistry = useInjectable<KeybindingRegistry>(KeybindingRegistry);
  const appConfig = useInjectable<AppConfig & AppCommonConfig>(AppConfig);

  const getKeybindingsForCommand = React.useCallback(
    (command: string) => {
      const keybindings = keybindingRegistry.getKeybindingsForCommand(command);
      if (keybindings.length > 0) {
        let keybinding = keybindingRegistry.acceleratorFor(keybindings[0], '+');
        return keybinding;
      }
      return [];
    },
    [keybindingRegistry],
  );

  const keyList = [
    {
      name: localize('common.command.file.search'),
      value: getKeybindingsForCommand('file-search.openFile'),
    },
    {
      name: localize('common.command.quickopen.command-terminal'),
      value: getKeybindingsForCommand('editor.action.quickCommand'),
    },
  ].filter((item) => item.value.length);

  return (
    <section className={styles.emptyContainer}>
      <div>
        <img src={appConfig.app?.logo} alt='logo' />
      </div>
      <p>{appConfig.app?.brandName}</p>
      <ul>
        {keyList.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>
              {item.value.map((keybinding, index) => {
                return (
                  <span key={index}>
                    {keybinding.split('+').map((char) => <i key={char}>{char.toUpperCase()}</i>)}
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
