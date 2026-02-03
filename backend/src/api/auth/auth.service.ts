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
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    private readonly sessionsService: SessionsService,
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
          expiresIn: '2h',
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
      hasrefreshToken: 'true',
    };
  }

  // Elimina updateRthashToken, ya no se usa en users

  async register({
    password,
    email,
    name,
    lastName,
  }: RegisterDto): Promise<Tokens> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await this.usersService.create({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    // Guarda el refresh token en la sesión
    const hashedRefreshToken = await bcryptjs.hash(tokens.refreshToken, 10);
    await this.sessionsService.create({
      user: newUser.id,
      company: null,
      jwt_token: tokens.accessToken,
      hashedRt: hashedRefreshToken,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return tokens;
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
}
