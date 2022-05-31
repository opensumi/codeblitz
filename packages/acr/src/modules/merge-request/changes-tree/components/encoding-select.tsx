import React from 'react';
import { observer } from 'mobx-react-lite';
import { useInjectable } from '@opensumi/ide-core-browser';
import { Select } from '@opensumi/ide-components';

import { IAntcodeService } from '../../../antcode-service/base';
import { antcodeEncodingOpts } from '../../../antcode-service';

export const EncodingSelect = observer(() => {
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);

  return (
    <Select
      options={antcodeEncodingOpts}
      value={antcodeService.encoding}
      onChange={(v) => {
        antcodeService.setEncoding(v);
      }}
    />
  );
});

EncodingSelect.displayName = 'EncodingSelect';
