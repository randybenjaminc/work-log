import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogsService } from './logs.service';
import { AuditLog } from './schemas/audit-log.schema';

@Controller()
export class LogsController {
  private readonly logger = new Logger(LogsController.name);

  constructor(private readonly logsService: LogsService) {}

  @MessagePattern('log.create')
  async handleCreate(@Payload() payload: Partial<AuditLog>) {
    this.logger.debug(`Received log.create: ${payload.action} from ${payload.userEmail}`);
    return this.logsService.create(payload);
  }

  @MessagePattern('log.findAll')
  async handleFindAll(
    @Payload()
    filters: {
      userId?: string;
      entity?: string;
      from?: string;
      to?: string;
      limit?: number;
    },
  ) {
    this.logger.debug(`Received log.findAll: ${JSON.stringify(filters)}`);
    return this.logsService.findAll(filters);
  }
}