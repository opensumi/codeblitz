import { useInjectable, ViewState } from '@opensumi/ide-core-browser';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { IExtensionManagerService } from './base';
import { ExtensionList } from './extension-list';
import { ExtensionManagerService } from './extension-manager.service';

export const ExtensionEnableAccordion: React.FC<{
  viewState: ViewState;
}> = observer(({ viewState }) => {
  const extensionManagerService = useInjectable<ExtensionManagerService>(IExtensionManagerService);

  return <ExtensionList height={viewState.height} list={extensionManagerService.rawExtension} />;
});
