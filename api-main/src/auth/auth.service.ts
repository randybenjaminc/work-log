import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    this.logger.log(`Registering new user: ${dto.email}`);
    const user = await this.usersService.create(dto);
    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for: ${dto.email}`);
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      this.logger.warn(`Failed login for: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Login successful for: ${user.id}`);
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}