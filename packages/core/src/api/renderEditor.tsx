import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { IReporterService, localize, getDebugLogger } from '@opensumi/ide-core-common';
import { REPORT_NAME } from '@codeblitzjs/ide-sumi-core';
import { createEditor } from './createEditor';
import { Root } from '../core/Root';
import { RootProps, LandingProps } from '../core/types';
import { useConstant } from '../core/hooks';
import { IConfig, IAppInstance } from './types';
import { EditorProps } from '../core/editor/types';
import { PropsServiceImpl, IPropsService } from '../core/props.service';
import styles from '../core/style.module.less';

interface IEditorRendererProps extends IConfig, EditorProps {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export const renderEditor = (domElement: HTMLElement, props: IEditorRendererProps) => {
  const { onLoad, Landing, ...opts } = props;
  const app = createEditor(opts);
  const className = `codeblitz-editor ${
    opts.runtimeConfig.hideEditorTab ? styles['hide-editor-tab'] : ''
  }`;

  const root = createRoot(domElement);

  root.render(<Root status="loading" Landing={Landing} className={className} />);

  app
    .start((Children) => {
      return new Promise((resolve) => {
        root.render(
          <Root status="success" className={className}>
            <Children />
          </Root>
        );
      });
    })
    .then(() => {
      onLoad?.(app);
    })
    .catch((err: Error) => {
      root.render(
        <Root
          status="error"
          error={err?.message || localize('error.unknown')}
          className={className}
        />
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

export const EditorRenderer: React.FC<IEditorRendererProps> = ({ onLoad, Landing, ...opts }) => {
  const app = useConstant(() => createEditor(opts));
  const appElementRef = useRef<React.ReactElement | null>(null);
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
      .start((appElement) => {
        appElementRef.current = appElement as unknown as React.ReactElement;
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
    <Root {...state} Landing={Landing} className={`alex-editor ${rootClassName}`}>
      {appElementRef.current}
    </Root>
  );
};
