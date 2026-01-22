import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorLogsService } from '../../error-logs/error-logs.service';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorLogsService: ErrorLogsService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let stack = '';
    let type = 'UnknownException';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      stack = exception.stack || '';
      type = exception.name || 'HttpException';
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack || '';
      type = exception.name || 'Error';
    } else if (typeof exception === 'string') {
      message = exception;
      type = 'StringException';
    }

    let userId: number | undefined = undefined;
    if (
      request.user &&
      typeof request.user === 'object' &&
      'id' in request.user
    ) {
      userId = (request.user as any).id;
    }

    // Guardar información adicional en context
    const context = {
      path: request.url,
      method: request.method,
      status,
      query: request.query,
      body: request.body,
      params: request.params,
      ip: request.ip,
      headers: request.headers,
    };

    await this.errorLogsService.create({
      message,
      stack,
      type,
      userId,
      context,
    });

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
