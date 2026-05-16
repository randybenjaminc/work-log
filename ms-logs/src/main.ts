import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = parseInt(process.env.LOG_MS_PORT ?? '4000', 10);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
    logger: ['log', 'warn', 'error', 'debug'],
  });

  await app.listen();
  logger.log(`ms-logs TCP microservice listening on port ${port}`);
}

bootstrap();