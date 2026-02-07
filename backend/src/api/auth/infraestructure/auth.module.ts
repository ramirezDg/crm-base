import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infraestructura
import { AuthController } from './http/auth.controller';
import { AtStrategy } from './jwt/strategies/jwt-strategy';
import { RtStrategy } from './jwt/strategies/jwt-strategy/rt.strategy';
import { SessionInterceptor } from '../../../common/interceptors/session.interceptor';
import { jwtConstants } from './jwt/jwt.constant';

// UseCases
import { RegisterUseCase } from '../aplication/use-cases/register.usecase';
import { LoginUseCase } from '../aplication/use-cases/login.usecase';
import { LogoutUseCase } from '../aplication/use-cases/logout.usecase';
import { RefreshTokenUseCase } from '../aplication/use-cases/refresh-token.usecase';

// Módulos externos que usamos
import { UsersModule } from '../../users/users.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { RolesModule } from '../../roles/roles.module';
import { RolePermission } from '../../role-permissions/entities/role-permission.entity';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    RolesModule,
    TypeOrmModule.forFeature([RolePermission]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // UseCases
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    // Estrategias JWT
    AtStrategy,
    RtStrategy,
    // Interceptor (opcional, solo si lo usas en providers)
    SessionInterceptor,
  ],
  exports: [
    // Exportamos los UseCases si algún otro módulo los necesita
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
  ],
})
export class AuthModule {}
