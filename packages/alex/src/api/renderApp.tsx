import React from 'react';
import ReactDOM from 'react-dom';
import { RenderedEvent, IEventBus } from '@ali/ide-core-browser';
import { Deferred } from '@ali/ide-core-common';
import { ClientApp } from '@alipay/alex-core';
import { createApp, IAppConfig } from './createApp';
import { Root } from '../core/Root';

export interface IRenderConfig extends IAppConfig {
  onLoad?(app: ClientApp): void;
  Landing?: React.ComponentType;
}

export const renderApp = (domElement: HTMLElement, opts: IRenderConfig) => {
  ReactDOM.render(<Root status="loading" />, domElement);

  const ready = new Deferred();
  const app = createApp(opts);

  app
    .start((appElement) => {
      return new Promise((resolve) => {
        ReactDOM.render(<Root status="success">{appElement}</Root>, domElement, resolve);
      });
    })
    .then(() => {
      ready.resolve();
    })
    .catch((err: Error) => {
      ReactDOM.render(<Root status="error" errorMessage={err?.message || ''} />, domElement);
      ready.reject();
    });
};
