import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IReporterService, localize, getDebugLogger } from '@ali/ide-core-common';
import { REPORT_NAME } from '@alipay/alex-core';
import { createEditor } from './createEditor';
import { Root } from '../core/Root';
import { RootProps, LandingProps } from '../core/types';
import { themeStorage } from '../core/utils';
import { useConstant } from '../core/hooks';
import { IConfig, IAppInstance } from './types';
import { EditorProps } from '../core/editor/types';
import { Container } from '../core/editor/container';

interface IRenderProps extends IConfig {
  onLoad?(app: IAppInstance): void;
  Landing?: React.ComponentType<LandingProps>;
}

export type IEditorRenderProps = IRenderProps & EditorProps;

export const renderEditor = (domElement: HTMLElement, props: IEditorRenderProps) => {
  const { onLoad, Landing, ...opts } = props;
  const app = createEditor(opts);
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

      (app.injector.get(
        IReporterService
      ) as IReporterService).point(REPORT_NAME.ALEX_APP_START_ERROR, err?.message, { error: err });
      getDebugLogger().error(err);
      setTimeout(() => {
        throw err;
      });
    });

  return () => {
    app.destroy();
  };
};

export const EditorRenderer: React.FC<IEditorRenderProps> = ({ onLoad, Landing, ...opts }) => {
  const app = useConstant(() => createEditor(opts));
  const themeType = useConstant(() => themeStorage.get());
  const appElementRef = useRef<React.ReactElement | null>(null);

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

  return (
    <Container value={{ documentModel: opts.documentModel }}>
      <Root {...state} theme={themeType} Landing={Landing}>
        {appElementRef.current}
      </Root>
    </Container>
  );
};
