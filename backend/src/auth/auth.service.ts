import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { LogoutDto } from './dto/logout.auth.dto';
import { JwtPayload, Tokens } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../role-permissions/entities/role-permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async getTokens(id: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '2h',
        },
      ),

      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: process.env.JWT_SECRET,
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

  async updateRthashToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    await this.usersService.update(id, { hashedRt: hashedRefreshToken });
  }

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
    await this.updateRthashToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async login({ email, password }: LoginDto): Promise<JwtPayload> {
    const user = await this.usersService.findOneByEmail(email, {
      relations: ['role'],
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
      name: `${user.name} ${user.lastName}`,
      permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRthashToken(user.id, tokens.refreshToken);

    return {
      accessToken,
      refreshToken,
      sub: user.id,
      email: user.email,
      name: `${user.name} ${user.lastName}`,
      permissions,
    };
  }

  async logout(id: string) {
    await this.usersService.update(id, { hashedRt: null });
    return true;
  }

  async refresh(id: string, refreshToken: string) {
    const user = await this.usersService.findOne(id);
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access denied');
    }
    const isRefreshTokenValid = await bcryptjs.compare(
      refreshToken,
      user.hashedRt,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRthashToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
