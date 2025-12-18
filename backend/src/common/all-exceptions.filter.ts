// backend/src/common/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      // Let Nest's HttpException shape pass through
      const status = exception.getStatus();
      const body = exception.getResponse();
      this.logger.warn(
        `HTTP ${status} on ${request.method} ${request.url}: ${JSON.stringify(body)}`,
      );
      response.status(status).json(body);
      return;
    }

    // Unexpected errors: log full details server-side
    this.logger.error(
      `Unexpected error on ${request?.method} ${request?.url}`,
      (exception as any)?.stack ?? String(exception),
    );

    // But send only a generic message to the client
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}