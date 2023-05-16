import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { IReporterService, localize, getDebugLogger } from '@opensumi/ide-core-common';
import { REPORT_NAME, RuntimeConfig } from '@alipay/alex-core';
import { createApp } from './createApp';
import { Root } from '../core/Root';
import { RootProps, LandingProps } from '../core/types';
import {
  setSingleInjector,
  singleInjector,
  useConstant,
  isRendered,
  setRendered,
  setSingleApp,
  singleApp,
} from '../core/hooks';
import { IConfig, IAppInstance } from './types';
import styles from '../core/style.module.less';

export interface IAppRendererProps extends IConfig {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export const renderApp = (domElement: HTMLElement, props: IAppRendererProps) => {
  const { onLoad, Landing, ...opts } = props;
  const app = createApp(opts);
  const themeType = app.currentThemeType;
  const className = opts.runtimeConfig.hideEditorTab ? styles['hide-editor-tab'] : '';

  ReactDOM.render(
    <Root status="loading" theme={themeType} Landing={Landing} className={className} />,
    domElement
  );

  app
    .start((appElement) => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <Root status="success" theme={themeType} className={className}>
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

      (app.injector.get(IReporterService) as IReporterService).point(
        REPORT_NAME.ALEX_APP_START_ERROR,
        err?.message,
        { error: err }
      );
      getDebugLogger().error(err);
      setTimeout(() => {
        throw err;
      });
    });

  return () => {
    app.destroy();
  };
};

export const AppRenderer: React.FC<IAppRendererProps> = ({ onLoad, Landing, ...opts }) => {
  const app = useConstant(() => createApp(opts));
  const themeType = useConstant(() => app.currentThemeType);
  const appElementRef = useRef<React.ReactElement | null>(null);

  // 确保回调始终为最新
  // TODO: 用 PropsService
  const runtimeConfig: RuntimeConfig = app.injector.get(RuntimeConfig);
  runtimeConfig.workspace = opts.runtimeConfig.workspace;

  const [state, setState] = useState<{
    status: RootProps['status'];
    error?: RootProps['error'];
  }>(() => ({ status: 'loading' }));

  useEffect(() => {
    app
      .start((appElement) => {
        appElementRef.current = appElement;
        setState({ status: 'success' });
        return Promise.resolve();
      })
      .then(() => {
        onLoad?.(app);
      })
      .catch((err: Error) => {
        setState({ error: err?.message || localize('error.unknown'), status: 'error' });

        (app.injector.get(IReporterService) as IReporterService).point(
          REPORT_NAME.ALEX_APP_START_ERROR,
          err?.message,
          {
            error: err,
          }
        );
        getDebugLogger().error(err);
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      app.destroy();
    };
  }, []);

  const rootClassName = useMemo(
    () => (opts.runtimeConfig.hideEditorTab ? styles['hide-editor-tab'] : ''),
    [opts.runtimeConfig.hideEditorTab]
  );

  return (
    <Root {...state} theme={themeType} Landing={Landing} className={rootClassName}>
      {appElementRef.current}
    </Root>
  );
};

const appContainer = document.createElement('div')
appContainer.style.width = '100%'
appContainer.style.height = '100%'

let appMounted = false

export const KeepAlive: React.FC<{ visible: boolean }> = (props) => {
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!appMounted) {
      appMounted = true
      ReactDOM.render(<>{props.children}</>, appContainer)
    }
  }, [])

  useEffect(() => {
    if (props.visible) {
      anchorRef?.current?.insertAdjacentElement('afterend', appContainer)
    }

    // return () => {
    //   try {
    //     if (anchorRef?.current?.parentNode !== null) {
    //       anchorRef?.current?.parentNode.removeChild(appContainer);
    //     }
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
  }, [props.visible])

  return <div ref={anchorRef} />
}



// 缓存apprender 每次渲染都不卸载组件
export const AppRenderer2: React.FC<IAppRendererProps> = ({ onLoad, Landing, ...opts }) => {
  const app = useConstant(() =>
    createApp({
      ...opts,
      // @ts-ignore
      injector: singleInjector,
    })
  );

  const themeType = useConstant(() => app.currentThemeType);
  const appElementRef = useRef<React.ReactElement | null>(null);
  setSingleInjector(app.injector);
  setSingleApp(app);
  // 确保回调始终为最新
  // TODO: 用 PropsService
  const runtimeConfig: RuntimeConfig = app.injector.get(RuntimeConfig);
  runtimeConfig.workspace = opts.runtimeConfig.workspace;

  const [state, setState] = useState<{
    status: RootProps['status'];
    error?: RootProps['error'];
  }>(() => ({ status: 'loading' }));

  useEffect(() => {
    app
      .start((appElement) => {
        appElementRef.current = appElement;
        setState({ status: 'success' });
        return Promise.resolve();
      })
      .then(() => {
        setRendered();
        onLoad?.(app);
      })
      .catch((err: Error) => {
        setState({ error: err?.message || localize('error.unknown'), status: 'error' });

        (app.injector.get(IReporterService) as IReporterService).point(
          REPORT_NAME.ALEX_APP_START_ERROR,
          err?.message,
          {
            error: err,
          }
        );
        getDebugLogger().error(err);
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      // app.destroy();
    };
  }, []);

  const rootClassName = useMemo(
    () => (opts.runtimeConfig.hideEditorTab ? styles['hide-editor-tab'] : ''),
    [opts.runtimeConfig.hideEditorTab]
  );

  return (
    <Root {...state} theme={themeType} Landing={Landing} className={rootClassName}>
      {appElementRef.current}
    </Root>
  );
};
