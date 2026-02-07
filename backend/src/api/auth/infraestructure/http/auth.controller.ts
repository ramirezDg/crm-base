import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from '../../aplication/dto/register-auth.dto';
import { LoginDto } from '../../aplication/dto/login-auth.dto';
import { JwtPayload } from '../../domain/types';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../../../../common/decorators';
import { RtGuard } from '../../../../common/guards/rt.guard';
import {
  ApiCookieAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SessionInterceptor } from '../../../../common/interceptors/session.interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RegisterUseCase } from '../../aplication/use-cases/register.usecase';
import { LoginUseCase } from '../../aplication/use-cases/login.usecase';
import { LogoutUseCase } from '../../aplication/use-cases/logout.usecase';
import { RefreshTokenUseCase } from '../../aplication/use-cases/refresh-token.usecase';

@ApiTags('Auth')
@ApiCookieAuth()
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: Object,
  })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const authHeader = req.headers['authorization'];
    let token: string | undefined;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    return this.registerUseCase.execute(registerDto, token ?? '');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseInterceptors(SessionInterceptor)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: Object,
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<JwtPayload> {
    return await this.loginUseCase.execute(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  logout(@GetCurrentUserId('sub') id: string) {
    return this.logoutUseCase.execute(id);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: Object,
  })
  refresh(@GetCurrentUserId('sub') id: string, @GetCurrentUser('refreshToken') refreshToken: string) {
    return this.refreshTokenUseCase.execute(id, refreshToken);
  }
}
