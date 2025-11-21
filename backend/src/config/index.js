import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  dataPath: process.env.DATA_PATH || './src/data/db.json',
};
