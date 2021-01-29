import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IReporterService, localize, getDebugLogger } from '@ali/ide-core-common';
import { createApp } from './createApp';
import { Root } from '../core/Root';
import { RootProps, LandingProps } from '../core/types';
import { themeStorage } from '../core/utils';
import { useConstant } from '../core/hooks';
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
      ReactDOM.render(
        <Root status="error" error={err?.message || localize('error.unknown')} theme={themeType} />,
        domElement
      );

      (app.injector.get(IReporterService) as IReporterService).point('alex:error', 'startApp', {
        err,
      });
      getDebugLogger().error(err);
      setTimeout(() => {
        throw err;
      });
    });

  return () => {
    app.destroy();
  };
};

export const AppRenderer: React.FC<IRenderProps> = ({ onLoad, Landing, ...opts }) => {
  const app = useConstant(() => createApp(opts));
  const themeType = useConstant(() => themeStorage.get());
  const [appElement, setAppElement] = useState<React.ReactElement | null>(null);

  const [state, setState] = useState<{
    status: RootProps['status'];
    error?: RootProps['error'];
  }>(() => ({ status: 'loading' }));

  useEffect(() => {
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
        setState({ error: err?.message || localize('error.unknown'), status: 'error' });

        (app.injector.get(IReporterService) as IReporterService).point('alex:error', 'startApp', {
          err,
        });
        getDebugLogger().error(err);
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      app.destroy();
    };
  }, []);

  return (
    <Root {...state} theme={themeType} Landing={Landing}>
      {appElement}
    </Root>
  );
};
