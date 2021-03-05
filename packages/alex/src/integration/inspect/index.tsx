import React from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer } from '../..';
import { Injectable, Provider, Autowired } from '@ali/common-di';
import { BrowserModule, Domain } from '@ali/ide-core-browser';
import { LaunchContribution, AppConfig } from '@alipay/alex-core';
import '../startup/languages';

@Domain(LaunchContribution)
class InspectContributions implements LaunchContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;

  launch() {
    this.appConfig.workspaceDir = '/';
  }
}

@Injectable()
export class InspectModule extends BrowserModule {
  providers: Provider[] = [InspectContributions];
}

/**
 * 用来查看根目录的文件
 */
ReactDOM.render(
  <AppRenderer
    appConfig={{
      workspaceDir: '/',
      modules: [InspectModule],
    }}
    runtimeConfig={{
      biz: 'inspect',
    }}
  />,
  document.getElementById('main')
);
