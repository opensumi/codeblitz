import { REPORT_NAME, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';
import { getDebugLogger, IReporterService, localize } from '@opensumi/ide-core-common';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useConstant } from '../core/hooks';
import { IPropsService, PropsServiceImpl } from '../core/props.service';
import { Root } from '../core/Root';
import styles from '../core/style.module.less';
import { LandingProps, RootProps } from '../core/types';
import { createApp } from './createApp';
import { IAppInstance, IConfig } from './types';

export interface IAppRendererProps extends IConfig {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export const renderApp = (domElement: HTMLElement, props: IAppRendererProps) => {
  const { onLoad, Landing, ...opts } = props;
  const app = createApp(opts);
  const themeType = app.currentThemeType;
  const className = opts.runtimeConfig.hideEditorTab ? styles['hide-editor-tab'] : '';
  const root = createRoot(domElement);

  root.render(<Root status='loading' theme={themeType} Landing={Landing} className={className} />);

  app
    .start((Children) => {
      return new Promise((resolve) => {
        root.render(
          <Root status='success' theme={themeType} className={className}>
            <Children />
          </Root>,
        );
      });
    })
    .then(() => {
      onLoad?.(app);
    })
    .catch((err: Error) => {
      root.render(
        <Root status='error' error={err?.message || localize('error.unknown')} theme={themeType} />,
      );

      (app.injector.get(IReporterService) as IReporterService).point(
        REPORT_NAME.ALEX_APP_START_ERROR,
        err?.message,
        { error: err },
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
  const appElementRef = useRef<React.FC | null>(null);
  const propsService = useConstant(() => new PropsServiceImpl<IAppRendererProps>());
  propsService.props = opts;

  const runtimeConfig: RuntimeConfig = app.injector.get(RuntimeConfig);
  runtimeConfig.workspace = opts.runtimeConfig.workspace;

  const [state, setState] = useState<{
    status: RootProps['status'];
    error?: RootProps['error'];
  }>(() => ({ status: 'loading' }));

  useMemo(() => {
    app.injector.addProviders({
      token: IPropsService,
      useValue: propsService,
    });
  }, []);

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
          },
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
    [opts.runtimeConfig.hideEditorTab],
  );

  return (
    <Root {...state} theme={themeType} Landing={Landing} className={rootClassName}>
      {appElementRef.current ? <appElementRef.current /> : null}
    </Root>
  );
};
