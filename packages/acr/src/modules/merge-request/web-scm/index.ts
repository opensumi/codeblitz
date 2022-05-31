import { View } from '@opensumi/ide-core-browser';

import { SCMResourceView } from './scm-resource.view';

import { WebSCMViewId } from './common';

export const WebSCMView: View = {
  id: WebSCMViewId,
  name: '%web-scm.title%',
  weight: 5,
  priority: 10,
  collapsed: true,
  component: SCMResourceView,
  // when: 'gitOpenRepositoryCount != 0',
};
