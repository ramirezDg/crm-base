import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../../../users/users.service';
import { RolesService } from '../../../roles/roles.service';
import { SessionsService } from '../../../sessions/sessions.service';
import { RegisterDto } from '../dto/register-auth.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly rolesService: RolesService,
  ) {}

  async execute(registerDto: RegisterDto, at: string): Promise<{ message: string }> {
    const { name, lastName, email, password } = registerDto;

    const user = await this.usersService.findOneByEmail(email);
    const session = await this.sessionsService.findActiveSession(at);
    if (at === '') {
      throw new BadRequestException('Token is required');
    }
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    if (session === null || session === undefined) {
      throw new BadRequestException('Active session already exists for token');
    }

    const [hashedPassword, roleDefault] = await Promise.all([
      bcryptjs.hash(password, 10),
      this.rolesService.findRoleDefault(),
    ]);

    if (!roleDefault) {
      throw new BadRequestException('Default role not found');
    }

    await this.usersService.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      role: roleDefault,
      company: session.company,
    });

    return { message: 'Usuario registrado correctamente' };
  }
}
