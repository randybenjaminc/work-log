import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${dto.email}`);

    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException(`Email ${dto.email} already registered`);
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, password: hashed });
    const saved = await this.usersRepository.save(user);

    this.logger.log(`User created: ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<User[]> {
    this.logger.debug('Fetching all users');
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}