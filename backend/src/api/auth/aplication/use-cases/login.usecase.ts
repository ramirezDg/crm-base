import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { RolePermission } from '../../../role-permissions/entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '../dto/login-auth.dto';
import { JwtPayload } from '../../domain/types';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async execute({ email, password }: LoginDto): Promise<JwtPayload> {
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
}
