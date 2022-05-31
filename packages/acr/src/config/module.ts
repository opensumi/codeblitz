// import { StatusBarModule } from '@opensumi/ide-status-bar/lib/browser';

import { CommonBrowserModules } from '../modules/common-modules';
import { CustomBrowserModules } from '../modules/custom-modules';

export const modules = [
  ...CommonBrowserModules,
  ...CustomBrowserModules,
  // StatusBarModule,
];
