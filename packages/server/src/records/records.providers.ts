import { DataSource } from 'typeorm';
import { Record } from './entity/record.entity';

export const recordProviders = [
  {
    provide: 'RECORDS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Record),
    inject: ['DATA_SOURCE'],
  },
];
