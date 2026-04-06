import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {    
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';


        const errorCode = exception instanceof HttpException
        ? (exception.getResponse() as any).errorCode || 'UNKNOWN_ERROR'
        : 'INTERNAL_SERVER_ERROR';

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: typeof message == 'string'
            ? message
            : (message as any).message || 'Internal server error',
            errorCode: errorCode || 'UNKNOWN_ERROR',
        });
    }
}