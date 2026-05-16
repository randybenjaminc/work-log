import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorklogsModule } from './worklogs/worklogs.module';
import { LogClientModule } from './log-client/log-client.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

import { User } from './users/entities/user.entity';
import { Worklog } from './worklogs/entities/worklog.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT', 5432),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [User, Worklog],
        synchronize: true,
        logging: ['error', 'warn'],
      }),
    }),

    AuthModule,
    UsersModule,
    WorklogsModule,
    LogClientModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}