import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Response as NestResponse,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { JwtPayload, Tokens } from './types';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { RtGuard } from '../common/guards';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiCookieAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  register(@Body() registerDto: RegisterDto): Promise<Tokens> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtPayload> {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId('sub') id: string) {
    return this.authService.logout(id);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId('sub') id: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(id, refreshToken);
  }
}
