import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorklogsService } from './worklogs.service';
import { CreateWorklogDto, UpdateWorklogDto } from './dto/worklog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('worklogs')
@UseGuards(JwtAuthGuard)
export class WorklogsController {
  private readonly logger = new Logger(WorklogsController.name);

  constructor(private readonly worklogsService: WorklogsService) {}

  @Post()
  create(@Body() dto: CreateWorklogDto, @CurrentUser() user: User) {
    this.logger.log(`POST /worklogs by ${user.id}`);
    return this.worklogsService.create(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    this.logger.log(`GET /worklogs by ${user.id} (role: ${user.role})`);
    return this.worklogsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    this.logger.log(`GET /worklogs/${id} by ${user.id}`);
    return this.worklogsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorklogDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`PATCH /worklogs/${id} by ${user.id}`);
    return this.worklogsService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    this.logger.warn(`DELETE /worklogs/${id} by ${user.id}`);
    return this.worklogsService.remove(id, user);
  }
}