import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        return {
          dialect: 'postgres' as Dialect,
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT') || 5432,
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          autoLoadModels: true,
          synchronize: !isProduction,
          logging: false,
          ssl: !isProduction,
          dialectOptions: {
            ssl: !isProduction ? false : { rejectUnauthorized: true },
          },
          sync: {
            // alter: !isProduction,
            // force: !isProduction,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
