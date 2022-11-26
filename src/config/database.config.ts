import { EnvironmentEnum } from '../common/constants/enums';

const databaseConfig = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  entities: [__dirname + '/../modules/*/entities/*.entity{.ts,.js}'],
  migrationsTableName: 'softic_migration_table',
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../migrations',
  },
  synchronize: true,
};

if (
  process.env.NODE_ENV === EnvironmentEnum.PRODUCTION ||
  process.env.NODE_ENV === EnvironmentEnum.DEVELOP
) {
  databaseConfig['ssl'] = {
    rejectUnauthorized: false,
  };
}

if (process.env.NODE_ENV === EnvironmentEnum.TEST) {
  Object.assign(databaseConfig, {
    type: process.env.TEST_DB_TYPE,
    host: process.env.TEST_DB_HOST,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    port: parseInt(process.env.TEST_DB_PORT),
    database: process.env.TEST_DB_NAME,
  });
}

export default databaseConfig;
