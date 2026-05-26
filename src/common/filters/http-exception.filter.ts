import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let errors = undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        if (Array.isArray(exceptionResponse.message)) {
          errors = { validation: exceptionResponse.message };
          message = 'Validation Error';
        } else {
          message = exceptionResponse.message as string;
        }
      }
      if ('error' in exceptionResponse && !errors) {
        errors = exceptionResponse.error;
      }
    }

    response.status(status).json({
      success: false,
      message,
      errors,
    });
  }
}
