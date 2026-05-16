import { Test, TestingModule } from '@nestjs/testing';
import { WorklogsService } from './worklogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Worklog } from './entities/worklog.entity';

describe('WorklogsService', () => {
  let service: WorklogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorklogsService,
        {
          provide: getRepositoryToken(Worklog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorklogsService>(WorklogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
