import databaseConfig from './database.config';
import oAuthConfig from './o-auth.config';

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE: databaseConfig,
  OAUTH: oAuthConfig,
};
