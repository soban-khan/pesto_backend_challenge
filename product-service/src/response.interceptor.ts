import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => ({
        isSuccess: statusCode >= 200 && statusCode < 300 ? true : false,
        error: data && data.message ? data.message : '',
        data: data,
      })),
    );
  }
}
