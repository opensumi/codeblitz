import React from 'react';
import { KeybindingRegistry } from '@ali/ide-core-browser';
import { useInjectable, localize } from '@ali/ide-core-browser';
import styles from './editor-empty.module.less';
import { CommonConfig } from '../../common/config';

export const EditorEmptyComponent: React.FC = () => {
  const keybindingRegistry = useInjectable<KeybindingRegistry>(KeybindingRegistry);
  const getKeybindingsForCommand = React.useCallback(
    (command: string) => {
      const keybindings = keybindingRegistry.getKeybindingsForCommand(command);
      if (keybindings.length > 0) {
        let keybinding = keybindingRegistry.acceleratorFor(keybindings[0], '+');
        return keybinding;
      }
      return [];
    },
    [keybindingRegistry]
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
        <img src={CommonConfig.logo} alt="logo" />
      </div>
      <p>{CommonConfig.brandName}</p>
      <ul>
        {keyList.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>
              {item.value.map((keybinding, index) => {
                return (
                  <span key={index}>
                    {keybinding.split('+').map((char) => (
                      <i key={char}>{char.toUpperCase()}</i>
                    ))}
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
