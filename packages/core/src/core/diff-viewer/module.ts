import { BrowserModule } from '@opensumi/ide-core-browser';

import { Injectable } from '@opensumi/di';
import { DiffViewerContribution } from './internal/base';
import { DiffViewerThemeProvider } from './internal/theme.provider';

@Injectable()
export class DiffViewerModule extends BrowserModule {
  providers = [
    DiffViewerContribution,
    DiffViewerThemeProvider,
  ];
}
