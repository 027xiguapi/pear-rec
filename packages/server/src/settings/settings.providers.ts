import { DataSource } from 'typeorm';
import { Setting } from './entity/setting.entity';

export const settingsProviders = [
  {
    provide: 'SETTINGS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Setting),
    inject: ['DATA_SOURCE'],
  },
];
