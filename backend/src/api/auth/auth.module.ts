import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { RolePermission } from '../role-permissions/entities/role-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtStrategy } from './strategies/jwt-strategy';
import { RtStrategy } from './strategies/jwt-strategy/rt.strategy';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RolePermission]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
