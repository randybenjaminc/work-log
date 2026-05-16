import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogClientService } from './log-client.service';
import { LOG_SERVICE } from './log-client.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: LOG_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('LOG_MS_HOST', 'ms-logs'),
            port: +config.get('LOG_MS_PORT', 4000),
          },
        }),
      },
    ]),
  ],
  providers: [LogClientService],
  exports: [LogClientService],
})
export class LogClientModule {}