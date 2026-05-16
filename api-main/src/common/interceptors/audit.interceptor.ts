import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogClientService } from '../../log-client/log-client.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly logClient: LogClientService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const responseTime = Date.now() - start;
          const user = req.user;
          const entity = this.extractEntity(req.path);

          this.logger.log(
            `[AUDIT] ${req.method} ${req.path} → ${res.statusCode} | user: ${user?.id ?? 'anonymous'} | ${responseTime}ms`,
          );

          this.logClient.emit({
            action: `${req.method}:${entity}`,
            entity,
            userId: user?.id,
            userEmail: user?.email,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            ip: req.ip || req.headers['x-forwarded-for'],
            requestBody: this.sanitizeBody(req.body),
            responseTime,
          });
        },
        error: (err) => {
          const responseTime = Date.now() - start;
          const user = req.user;
          const entity = this.extractEntity(req.path);

          this.logger.warn(
            `[AUDIT] ${req.method} ${req.path} → ${err.status ?? 500} | user: ${user?.id ?? 'anonymous'} | ${responseTime}ms | error: ${err.message}`,
          );

          this.logClient.emit({
            action: `${req.method}:${entity}:ERROR`,
            entity,
            userId: user?.id,
            userEmail: user?.email,
            method: req.method,
            path: req.path,
            statusCode: err.status ?? 500,
            ip: req.ip,
            responseTime,
          });
        },
      }),
    );
  }

  private extractEntity(path: string): string {
    const parts = path.split('/').filter(Boolean);
    return parts[2] ?? parts[1] ?? 'unknown';
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;
    const { password, ...safe } = body;
    return safe;
  }
}