import React from 'react';
import { localize } from '@ali/ide-core-common';
import { useInjectable, getOctIcon } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { Input, Button } from '@ali/ide-components';
import { GitHubService } from './github.service';
import styles from './github.module.less';

export const GitHubView: React.FC = () => {
  const { rateLimit } = useInjectable(ICodeAPIService) as GitHubService;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{localize('github.rate-limiting-info')}</div>
      <ul className={styles.rateList}>
        <li>
          {localize('github.rate-limit-limit')}:{' '}
          <span className={styles.rateData}>{rateLimit.limit}</span>
        </li>
        <li>
          {localize('github.rate-limit-remaining')}:{' '}
          <span className={styles.rateData}>{rateLimit.remaining}</span>
        </li>
        <li>
          {localize('github.rate-limit-reset')}:{' '}
          <span className={styles.rateData}>{formateTime(rateLimit.reset * 1000)}</span>
        </li>
      </ul>
      <div className={styles.title}>
        {localize('github.auth-title')}
        <a
          href="https://github.com/settings/tokens/new?scopes=repo&description=Ant%20Codespaces"
          target="_blank"
          style={{ marginLeft: 8 }}
        >
          <i className={getOctIcon('link')}></i> {localize('github.auth-goto')}
        </a>
      </div>
      <div className={styles.authTip}>{localize('github.auth-tip')} </div>
      <div className={styles.authInput}>
        <Input size="small" placeholder={`${localize('github.auth-input')} OAuth Token`} />
      </div>
      <div>
        <Button size="small" style={{ marginRight: 8 }}>
          {localize('common.save')}
        </Button>
        <Button size="small">{localize('common.reset')}</Button>
      </div>
    </div>
  );
};

function formateTime(n: number) {
  console.log(n);
  if (n <= 0) return '-';
  const date = new Date(n);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
