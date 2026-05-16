import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLog } from './schemas/audit-log.schema';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
