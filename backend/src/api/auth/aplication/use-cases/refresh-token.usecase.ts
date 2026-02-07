import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../../../users/users.service';
import { SessionsService } from '../../../sessions/sessions.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '../../domain/types';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(id: string, refreshToken: string): Promise<Tokens> {
    const session = await this.sessionsService.findOne(id);
    if (!session || !session.hashedRt) {
      throw new ForbiddenException('Access denied');
    }

    const isRefreshTokenValid = await bcryptjs.compare(refreshToken, session.hashedRt);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default_secret_key';

    // Genera nuevos tokens
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      { secret: jwtSecret, expiresIn: '2h' },
    );

    const newRefreshToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      { secret: jwtSecret, expiresIn: '2h' },
    );

    const hashedRefreshToken = await bcryptjs.hash(newRefreshToken, 10);

    await this.sessionsService.update(session.id, {
      hashedRt: hashedRefreshToken,
      jwt_token: accessToken,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
        hasRefreshToken: true,
      };
      
  }
}
