import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({
  collection: 'audit_logs',
  timestamps: true,
  versionKey: false,
})
export class AuditLog {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entity: string;

  @Prop()
  userId?: string;

  @Prop()
  userEmail?: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop()
  ip?: string;

  @Prop({ type: Object })
  requestBody?: Record<string, any>;

  @Prop()
  responseTime?: number;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// índices para queries frecuentes
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ entity: 1, action: 1 });
AuditLogSchema.index({ createdAt: -1 });