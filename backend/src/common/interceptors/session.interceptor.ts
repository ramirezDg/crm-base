import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionsService } from '../../api/sessions/sessions.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private readonly sessionService: SessionsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async (data) => {
        if (data.sub && req) {
          const [refreshTokenHash, accesTokenHash] = await Promise.all([
            bcryptjs.hash(data.refreshToken, 10),
            bcryptjs.hash(data.accessToken, 10),
          ]);
          await this.sessionService.create({
            user: data.sub,
            company: data.company || null,
            hashedAt: accesTokenHash,
            hashedRt: refreshTokenHash,
            user_agent: req.headers['user-agent'],
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
        }
      }),
    );
  }
}
