import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { JwtPayload, Tokens } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../role-permissions/entities/role-permission.entity';
import { Repository } from 'typeorm';
import { SessionsService } from '../sessions/sessions.service';
import { MailerService } from '../../common/mailer/mailer.service';
import { RolesService } from '../roles/roles.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    private readonly sessionsService: SessionsService,
    private readonly mailerService: MailerService,
    private readonly rolesService: RolesService,
  ) {}

  async getTokens(id: string, email: string) {
    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default_secret_key';
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: jwtSecret,
          expiresIn: '2h',
        },
      ),

      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: jwtSecret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
      hasrefreshToken: 'true',
    };
  }

  async register(
    registerDto: RegisterDto,
    at: string,
  ): Promise<{ message: string }> {
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

    console.log('session', session);

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

  async login({ email, password }: LoginDto): Promise<JwtPayload> {
    const user = await this.usersService.findOneByEmail(email, {
      relations: ['role', 'company'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { id: user.role.id } },
      relations: ['permission'],
    });

    const permissions = rolePermissions
      .map((rp) => rp.permission?.key)
      .filter(Boolean);

    const payload = {
      sub: user.id,
      email: user.email,
      company: user.company ? user.company : null,
      name: `${user.name} ${user.lastName}`,
      permissions,
    };

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default_secret_key';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '2h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '2h',
    });

    return {
      accessToken,
      refreshToken,
      sub: user.id,
      email: user.email,
      name: `${user.name} ${user.lastName}`,
      company: user.company ? user.company.id : null,
    };
  }

  async logout(id: string) {
    await this.sessionsService.remove(id);
    return true;
  }

  async refresh(id: string, refreshToken: string) {
    const session = await this.sessionsService.findOne(id);
    if (!session || !session.hashedRt) {
      throw new ForbiddenException('Access denied');
    }
    const isRefreshTokenValid = await bcryptjs.compare(
      refreshToken,
      session.hashedRt,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const tokens = await this.getTokens(user.id, user.email);
    const hashedRefreshToken = await bcryptjs.hash(tokens.refreshToken, 10);

    await this.sessionsService.update(session.id, {
      hashedRt: hashedRefreshToken,
      jwt_token: tokens.accessToken,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return tokens;
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedTempPassword = await bcryptjs.hash(tempPassword, 10);
    await this.usersService.update(user.id, { password: hashedTempPassword });

    await this.mailerService.sendMail(
      user.email,
      'Recuperación de contraseña',
      'Se ha generado una nueva contraseña temporal para su cuenta.',
      'Recuperación de contraseña',
      `<b>Hola, ${user.name || ''} ${user.lastName || ''}!</b><br>Su nueva contraseña temporal es: <b>${tempPassword}</b><br>Por favor, cambie su contraseña después de iniciar sesión.`,
    );
    return true;
  }
}
