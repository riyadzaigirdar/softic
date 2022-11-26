import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as pgError from 'pg-error';
import { EnvironmentEnum } from '../constants/enums';
import { ResponseDto } from '../constants/common.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse<any>(),
      request = ctx.getRequest<Request>();

    let message: string = '',
      code: number = 400;

    const date = new Date();

    if (
      exception instanceof HttpException ||
      exception instanceof BadRequestException ||
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException
    ) {
      if (exception['response'] && exception['response'].message) {
        message = exception['response'].message;
      } else {
        message = exception['message'];
      }

      code =
        exception instanceof ForbiddenException
          ? 403
          : exception instanceof UnauthorizedException
          ? 401
          : 400;
    } else if (exception instanceof pgError) {
      this.errorLog(
        `Route: ${request.method} ${date.toUTCString()} ${
          request.url
        }\nError: ${exception.stack}`,
      );
      message = Object.values(exception['errors'])[0]['message'];
      if (process.env.NODE_ENV === EnvironmentEnum.PRODUCTION)
        message = 'something went wrong! Please try again later';
    } else if (exception instanceof HttpException) {
      this.errorLog(
        `Route: ${request.method} ${date.toUTCString()} ${
          request.url
        }\nError: ${exception.stack}`,
      );

      if (exception['response'] && exception['response'].message) {
        message = exception['response'].message;
      } else {
        message = exception['message'];
      }

      code = exception.getStatus();
    } else {
      this.errorLog(
        `CRITICAL Route: ${request.method} ${date.toUTCString()} ${
          request.url
        }\nError: ${exception.stack}`,
      );

      if (exception['response'] && exception['response'].message) {
        message = exception['response'].message;
      } else {
        message = exception['message'];
      }

      if (process.env.NODE_ENV === EnvironmentEnum.PRODUCTION) {
        message = 'something went wrong! Please try again later';
      }
    }

    const data: ResponseDto = {
      code,
      success: false,
      message: message,
      data:
        exception['response'] && exception['response'].data
          ? exception['response'].data
          : null,
    };

    response.status(code).send(data);
  }

  private errorLog = (errorString): void => {
    // ========== DOCKER LOG FOR BOTH DEVELOP AND PRODUCTION ============== //
    Logger.error(errorString);
  };
}
