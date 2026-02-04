import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from '../../api/sessions/sessions.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.replace('Bearer ', '');
    const payload = await this.jwtService.verifyAsync(token);
    const session = await this.sessionService.findOne(payload.sub);

    const isValid = session && (await bcrypt.compare(token, session.hashedAt));
    if (!session || !isValid) {
      throw new UnauthorizedException('Invalid session');
    }


    request.session = session;
    return true;
  }
}
