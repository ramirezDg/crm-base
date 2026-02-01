import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ActivityLogsService } from '../../api/activity-logs/activity-logs.service';
@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const controllerName = context
      .getClass()
      .name.replace('Controller', '')
      .toLowerCase();
    const handlerName = context.getHandler().name;

    return next.handle().pipe(
      tap((data) => {
        let entityId: string | null = null;
        const userAgent = request.headers['user-agent'] || null;

        const method = request.method;
        const isLogin =
          method === 'POST' &&
          (request.route?.path === '/auth/login' ||
            request.url?.includes('/auth/login'));
        const isLogout =
          method === 'POST' &&
          (request.route?.path === '/auth/logout' ||
            request.url?.includes('/auth/logout'));
        const isCreate = method === 'POST' && !isLogin && !isLogout;
        const isUpdate = method === 'PUT' || method === 'PATCH';
        const isDelete = method === 'DELETE';

        if (!(isCreate || isUpdate || isDelete || isLogin || isLogout)) {
          return;
        }

        if ((isCreate || isUpdate || isDelete) && data && data.id) {
          entityId = data.id;
        }

        if (isLogin && data && (data.sub || data.email)) {
          this.activityLogsService.create({
            userId: data.sub,
            entity: controllerName,
            entityAction: handlerName,
            entityId: null,
            userAgent,
          });
        } else if (user && (user.id || user.sub)) {
          this.activityLogsService.create({
            userId: user.id || user.sub,
            entity: controllerName,
            entityAction: handlerName,
            entityId: entityId,
            userAgent,
          });
        }
      }),
    );
  }
}
