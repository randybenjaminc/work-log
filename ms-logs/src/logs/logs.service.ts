import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(payload: Partial<AuditLog>): Promise<AuditLog> {
    this.logger.debug(
      `Saving audit log: ${payload.action} | user: ${payload.userId ?? 'anonymous'} | status: ${payload.statusCode}`,
    );

    const log = new this.auditLogModel(payload);
    const saved = await log.save();

    this.logger.log(
      `Audit log saved: ${saved._id} | ${payload.action} | ${payload.userEmail ?? '—'} | ${payload.responseTime}ms`,
    );

    return saved;
  }

  async findAll(filters: {
    userId?: string;
    entity?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<AuditLog[]> {
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.entity) query.entity = filters.entity;
    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) query.createdAt.$gte = new Date(filters.from);
      if (filters.to) query.createdAt.$lte = new Date(filters.to);
    }

    this.logger.debug(`Querying audit logs: ${JSON.stringify(query)}`);

    return this.auditLogModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit ?? 100)
      .lean()
      .exec();
  }
}