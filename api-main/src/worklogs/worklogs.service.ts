import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worklog } from './entities/worklog.entity';
import { CreateWorklogDto, UpdateWorklogDto } from './dto/worklog.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class WorklogsService {
  private readonly logger = new Logger(WorklogsService.name);

  constructor(
    @InjectRepository(Worklog)
    private readonly worklogsRepository: Repository<Worklog>,
  ) {}

  async create(dto: CreateWorklogDto, user: User): Promise<Worklog> {
    this.logger.log(`Creating worklog for user ${user.id} - project: ${dto.project}`);
    const worklog = this.worklogsRepository.create({ ...dto, user });
    const saved = await this.worklogsRepository.save(worklog);
    this.logger.log(`Worklog created: ${saved.id}`);
    return saved;
  }

  async findAll(user: User): Promise<Worklog[]> {
    this.logger.debug(`findAll - user: ${user.id} role: ${user.role}`);

    if (user.role === UserRole.ADMIN) {
      return this.worklogsRepository.find({ order: { createdAt: 'DESC' } });
    }

    return this.worklogsRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Worklog> {
    const worklog = await this.worklogsRepository.findOne({ where: { id } });
    if (!worklog) throw new NotFoundException(`Worklog ${id} not found`);
    this.checkOwnership(worklog, user);
    return worklog;
  }

  async update(id: string, dto: UpdateWorklogDto, user: User): Promise<Worklog> {
    const worklog = await this.findOne(id, user);
    this.logger.log(`Updating worklog ${id} by user ${user.id}`);
    Object.assign(worklog, dto);
    return this.worklogsRepository.save(worklog);
  }

  async remove(id: string, user: User): Promise<void> {
    const worklog = await this.findOne(id, user);
    this.logger.warn(`Deleting worklog ${id} by user ${user.id}`);
    await this.worklogsRepository.remove(worklog);
  }

  private checkOwnership(worklog: Worklog, user: User): void {
    if (user.role === UserRole.ADMIN) return;
    if (worklog.user.id !== user.id) {
      this.logger.warn(`Forbidden: user ${user.id} tried to access worklog ${worklog.id}`);
      throw new ForbiddenException('You can only access your own worklogs');
    }
  }
}