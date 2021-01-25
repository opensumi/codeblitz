import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ClientApp } from '@alipay/alex-core';
import { createApp } from './createApp';
import { Root } from '../core/Root';
import { RootProps, LandingProps } from '../core/types';
import { themeStorage } from '../core/utils';
import { IConfig, IAppInstance } from './types';

export interface IRenderProps extends IConfig {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export const renderApp = (domElement: HTMLElement, props: IRenderProps) => {
  const { onLoad, Landing, ...opts } = props;
  const app = createApp(opts);
  const themeType = themeStorage.get();
  ReactDOM.render(<Root status="loading" theme={themeType} Landing={Landing} />, domElement);

  app
    .start((appElement) => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <Root status="success" theme={themeType}>
            {appElement}
          </Root>,
          domElement,
          resolve
        );
      });
    })
    .then(() => {
      onLoad?.(app);
    })
    .catch((err: Error) => {
      console.error(err);
      ReactDOM.render(
        <Root status="error" error={err?.message || ''} theme={themeType} />,
        domElement
      );
    });
};

export const AppRenderer: React.FC<IRenderProps> = ({ onLoad, Landing, ...opts }) => {
  const themeType = useMemo(() => themeStorage.get(), []);
  const [appElement, setAppElement] = useState<React.ReactElement | null>(null);

  const [state, setState] = useState<{
    status: RootProps['status'];
    error?: RootProps['error'];
  }>(() => ({ status: 'loading' }));

  useEffect(() => {
    const app = createApp(opts);
    app
      .start((appElement) => {
        setAppElement(appElement);
        return Promise.resolve();
      })
      .then(() => {
        setState({ status: 'success' });
        onLoad?.(app);
      })
      .catch((err: Error) => {
        console.error(err);
        setState({ error: err?.message || '', status: 'error' });
      });

    return () => {
      app.dispose();
    };
  }, []);

  return (
    <Root {...state} theme={themeType} Landing={Landing}>
      {appElement}
    </Root>
  );
};
