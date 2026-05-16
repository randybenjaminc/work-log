import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LOG_SERVICE } from './log-client.constants';

export interface AuditPayload {
  action: string;
  entity: string;
  userId?: string;
  userEmail?: string;
  method: string;
  path: string;
  statusCode: number;
  ip?: string;
  requestBody?: any;
  responseTime?: number;
}

@Injectable()
export class LogClientService {
  private readonly logger = new Logger(LogClientService.name);

  constructor(@Inject(LOG_SERVICE) private readonly client: ClientProxy) {}

  emit(payload: AuditPayload): void {
    this.logger.debug(`Emitting audit log: ${payload.action} on ${payload.entity}`);
    this.client.emit('log.create', payload).subscribe({
      error: (err) =>
        this.logger.error(`Failed to emit log to ms-logs: ${err.message}`),
    });
  }
}