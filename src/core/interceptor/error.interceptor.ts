import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let message =
          err instanceof HttpException
            ? err.getResponse()
            : 'Internal server error';

        const formattedError = {
          code: status,
          message:
            typeof message === 'string'
              ? message
              : (message as any).message || message,
          timestamp: new Date().toISOString(),
        };

        return throwError(() => formattedError);
      }),
    );
  }
}
