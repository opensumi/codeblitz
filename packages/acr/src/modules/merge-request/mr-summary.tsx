import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
  useInjectable,
  localize,
  formatLocalize,
  useUpdateOnEvent,
} from '@opensumi/ide-core-browser';
import { IAntcodeService } from '../antcode-service/base';
import * as styles from './styles.module.less';

export const MergeRequestSummary = observer(() => {
  const antcodeService = useInjectable<IAntcodeService>(IAntcodeService);

  useUpdateOnEvent(antcodeService.onDidViewChange, []);
  return (
    <div className={styles.summary}>
      <div className={styles.readSum}>
        {antcodeService.isDiffOverview
          ? `${localize('misc.viewed')} ${antcodeService.viewedChangeFileSize}/${formatLocalize(
              'misc.viewed.files',
              antcodeService.changeFileSize
            )}`
          : `${formatLocalize('misc.viewed.files', antcodeService.changeFileSize)}`}
      </div>
      <div>
        {antcodeService.addLineNum ? (
          <span className={styles.addLineNum}>+{antcodeService.addLineNum}</span>
        ) : (
          ''
        )}
        {antcodeService.deleteLineNum ? (
          <span className={styles.deleteLineNum}>-{antcodeService.deleteLineNum}</span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
});
