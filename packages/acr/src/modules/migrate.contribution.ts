import { LaunchContribution } from '@alipay/alex-core';
import { Domain } from '@opensumi/ide-core-common';
import { migrateSettings } from '../utils/migrate';

@Domain(LaunchContribution)
export class MigrateContribution implements LaunchContribution {
  launch() {
    return migrateSettings();
  }
}
