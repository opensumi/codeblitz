import { REPORT_NAME } from '@codeblitzjs/ide-sumi-core';
import { getDebugLogger, IReporterService, localize } from '@opensumi/ide-core-common';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { EditorProps } from '../core/editor/types';
import { useConstant } from '../core/hooks';
import { IPropsService, PropsServiceImpl } from '../core/props.service';
import { Root } from '../core/Root';
import styles from '../core/style.module.less';
import { LandingProps, RootProps } from '../core/types';
import { createEditor } from './createEditor';
import { IAppInstance, IConfig } from './types';

interface IEditorRendererProps extends IConfig, EditorProps {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export const renderEditor = (domElement: HTMLElement, props: IEditorRendererProps) => {
  const { onLoad, Landing, ...opts } = props;
  const app = createEditor(opts);
  const className = `codeblitz-editor ${opts.runtimeConfig.hideEditorTab ? styles['hide-editor-tab'] : ''}`;

  const root = createRoot(domElement);

  root.render(<Root status='loading' Landing={Landing} className={className} />);

  app
    .start((IDEApp) => {
      return new Promise((resolve) => {
        root.render(
          <Root status='success' className={className}>
            <IDEApp />
          </Root>,
        );
      });
    })
    .then(() => {
      onLoad?.(app);
    })
    .catch((err: Error) => {
      root.render(
        <Root
          status='error'
          error={err?.message || localize('error.unknown')}
          className={className}
        />,
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

export const EditorRenderer: React.FC<IEditorRendererProps> = ({ onLoad, Landing, ...opts }) => {
  const app = useConstant(() => createEditor(opts));
  const ideAppRef = useRef<React.FC | null>(null);
  const propsService = useConstant(() => new PropsServiceImpl<EditorProps>());

  propsService.props = { documentModel: opts.documentModel, editorConfig: opts.editorConfig };

  const [state, setState] = useState<{
    status: RootProps['status'];
    error?: RootProps['error'];
  }>(() => ({ status: 'loading' }));

  useEffect(() => {
    app.injector.addProviders({
      token: IPropsService,
      useValue: propsService,
    });

    app
      .start((IDEApp) => {
        ideAppRef.current = IDEApp;
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
    <Root {...state} Landing={Landing} className={`alex-editor ${rootClassName}`}>
      {ideAppRef.current ? <ideAppRef.current /> : null}
    </Root>
  );
};
