import React from 'react';
import ReactDOM from 'react-dom';
import { Deferred } from '@ali/ide-core-common';
import { IClientAppOpts } from '@alipay/spacex-core';
import { createApp } from '../core/createApp';
import { Root } from '../core/Root';

export interface IWorkspaceOptions extends IClientAppOpts {}

export const createWorkspace = (domElement: HTMLElement, opts: IWorkspaceOptions) => {
  const ready = new Deferred();
  const app = createApp(opts);

  ReactDOM.render(<Root status="loading" theme="light" />, domElement);

  app
    .start((appElement) => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <Root status="loading" theme="light">
            {appElement}
          </Root>,
          domElement,
          resolve
        );
      });
    })
    .catch((err: Error) => {
      ReactDOM.render(<Root status="error" theme="light" errorMessage={err.message} />, domElement);
    });

  return {
    app,
    ready,
  };
};
