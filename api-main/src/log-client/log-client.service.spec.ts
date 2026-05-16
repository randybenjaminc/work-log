import { Test, TestingModule } from '@nestjs/testing';
import { LogClientService } from './log-client.service';
import { LOG_SERVICE } from './log-client.constants';
import { of } from 'rxjs';

describe('LogClientService', () => {
  let service: LogClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogClientService,
        {
          provide: LOG_SERVICE,
          useValue: {
            emit: jest.fn(() => of(null)),
          },
        },
      ],
    }).compile();

    service = module.get<LogClientService>(LogClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
