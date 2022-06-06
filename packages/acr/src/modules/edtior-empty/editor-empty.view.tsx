import React from 'react';
import { useInjectable, localize } from '@opensumi/ide-core-browser';

import { EditorEmptyService } from './editor-empty.service';
import styles from './editor-empty.module.less';

const separator = '/';

export const EditorEmptyComponent: React.FC = () => {
  const keybindings: EditorEmptyService = useInjectable(EditorEmptyService);

  const keyList = [
    {
      name: localize('commands.markAsRead'),
      value: keybindings.getKeybindingsForCommand('commands.markAsRead'),
    },
    {
      name: localize('commands.quick-open.change-files'),
      value: keybindings.getKeybindingsForCommand('commands.quick-open.change-files'),
    },
    {
      name: localize('misc.switch.change-files'),
      value: 'Alt+↑+/+↓',
    },
  ];

  const brandName = 'Ant Codespaces';

  return (
    <section className={styles.editorEmpty}>
      <img
        className={styles.logo}
        src="https://gw.alipayobjects.com/zos/bmw-prod/88f3f739-1b77-4d23-abcd-25095ad5383e.svg"
        alt="logo"
      />
      <div className={styles.title}>{brandName}</div>
      <div className={styles.description}>{localize('misc.ide-mode.description')}</div>
      <div className={styles.keybindings}>
        {keyList.map((item) => (
          <div key={item.name} className={styles.keybinding}>
            <div className={styles.desc}>{item.name}</div>
            <div className={styles.key}>
              {item.value &&
                item.value.split('+').map((key) => {
                  return (
                    <span key={key} className={key === separator ? styles.separator : styles.icon}>
                      {key}
                    </span>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        Powered by{' '}
        <a href="https://ide.alipay.com" target="_blank" rel="noreferrer">
          {brandName}
        </a>
      </div>
    </section>
  );
};
