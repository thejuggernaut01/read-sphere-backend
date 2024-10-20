import * as dotenv from 'dotenv';
dotenv.config();

interface IEnvironment {
  APP: {
    NAME: string;
    PORT: number;
    ENV: string;
  };
  DB: {
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
    HOST: string;
    PORT: number;
  };
  JWT: {
    ACCESS_TOKEN: string;
    REFRESH_TOKEN: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
  };
  SMTP: {
    PROJECT_ID: string;
    SENDER_ADDRESS: string;
    PROJECT_SECRETS: string;
  };
}

const isProduction = process.env.NODE_ENV === 'production';

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: Number(process.env.PORT || process.env.APP_PORT || 4000),
    ENV: process.env.NODE_ENV,
  },
  DB: {
    USERNAME: isProduction
      ? process.env.PROD_DB_USERNAME
      : process.env.DEV_DB_USERNAME,
    PASSWORD: isProduction
      ? process.env.PROD_DB_PASSWORD
      : process.env.DEV_DB_PASSWORD,
    NAME: isProduction ? process.env.PROD_DB_USERNAME : process.env.DEV_DB_NAME,
    HOST: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
    PORT: Number(process.env.DB_PORT),
  },
  JWT: {
    ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
    ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  SMTP: {
    PROJECT_ID: process.env.SMTP_PROJECT_ID,
    SENDER_ADDRESS: process.env.SMTP_SENDER_ADDRESS,
    PROJECT_SECRETS: process.env.SMTP_PROJECT_SECRETS,
  },
};
