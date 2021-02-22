import React, { useState, useReducer } from 'react';
import { localize } from '@ali/ide-core-common';
import { useInjectable, getOctIcon } from '@ali/ide-core-browser';
import { ICodeAPIService } from '@alipay/alex-code-service';
import { Input, Button } from '@ali/ide-components';
import { observer } from 'mobx-react-lite';
import { GitLabService } from './gitlab.service';
import styles from './gitlab.module.less';

const updateReducer = (num: number): number => (num + 1) % 1_000_000;
const useUpdate = () => {
  const [, update] = useReducer(updateReducer, 0);
  return update;
};

export const GitLabView: React.FC = observer(() => {
  const codeAPI = useInjectable<GitLabService>(ICodeAPIService);
  const [tokenValue, setTokenValue] = useState('');
  const [validating, setValidating] = useState(false);
  const forceUpdate = useUpdate();

  const validateToken = async () => {
    if (!tokenValue) return;
    setValidating(true);
    try {
      const valid = await codeAPI.validateToken(tokenValue);
      if (valid) {
        setTokenValue('');
      }
    } finally {
      setValidating(false);
    }
  };

  const clearToken = () => {
    codeAPI.clearToken();
    forceUpdate();
  };

  const renderNoToken = () => {
    return (
      <div>
        <div className={styles.title}>
          {localize('gitlab.auth-title')}
          <a
            href="https://gitlab.alibaba-inc.com/profile/account"
            target="_blank"
            style={{ marginLeft: 8 }}
          >
            <i className={getOctIcon('link')}></i> {localize('gitlab.auth-goto')}
          </a>
        </div>
        <div className={styles.authTip}>{localize('gitlab.auth-tip')} </div>
        <div className={styles.authInput}>
          <Input
            size="small"
            placeholder={`${localize('gitlab.auth-input')} Private Token`}
            value={tokenValue}
            onChange={(e) => setTokenValue(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Button
            size="small"
            style={{ marginRight: 8 }}
            onClick={validateToken}
            loading={validating}
          >
            {localize('common.save')}
          </Button>
          <Button
            size="small"
            type="default"
            onClick={() => setTokenValue('')}
            loading={validating}
          >
            {localize('common.reset')}
          </Button>
        </div>
      </div>
    );
  };

  const renderHasToken = () => {
    const token = codeAPI.PRIVATE_TOKEN!;
    return (
      <div>
        <div className={styles.title}>{localize('gitlab.auth-has-token-title')}</div>
        <div>{localize('gitlab.auth-cur-token')}</div>
        <div>
          {token.slice(0, 6)}
          {token.slice(6).replace(/./g, '*')}
        </div>
        <div style={{ marginTop: 8 }}>
          <Button onClick={clearToken} type="default">
            {localize('common.clear')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {codeAPI.PRIVATE_TOKEN ? renderHasToken() : renderNoToken()}
    </div>
  );
});
