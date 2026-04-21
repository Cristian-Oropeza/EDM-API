import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LogsService } from '../../modules/logs/interfaces/logs.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message
        : typeof exceptionResponse === 'string'
          ? exceptionResponse
          : 'Internal server error';

    const errorCode = this.resolveErrorCode(status, exceptionResponse);

    // Guardar log en BD
    const sessionId = request['user']?.id ?? null;
    await this.logsService.createLog({
      status_code: status,
      path: request.url,
      error: typeof message === 'string' ? message : JSON.stringify(message),
      error_code: errorCode,
      session_id: sessionId,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
      errorCode: errorCode,
    });
  }

  private resolveErrorCode(status: number, exceptionResponse: any): string {
    // Si el controller mandó un errorCode explícito, lo usamos
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      exceptionResponse.errorCode &&
      exceptionResponse.errorCode !== 'UNKNOWN_ERROR'
    ) {
      return exceptionResponse.errorCode;
    }

    // Si no, lo derivamos del status code
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'VALIDATION_ERROR';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'UNKNOWN_ERROR';
    }
  }
}