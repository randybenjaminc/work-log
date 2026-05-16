import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worklog } from './entities/worklog.entity';
import { WorklogsService } from './worklogs.service';
import { WorklogsController } from './worklogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Worklog])],
  providers: [WorklogsService],
  controllers: [WorklogsController],
})
export class WorklogsModule {}