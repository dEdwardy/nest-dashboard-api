import { ArgumentsHost, Catch, ExceptionFilter, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const message = exception.message
    const status = exception.getStatus()
    console.log('filters')
    res.status(HttpStatus.OK).json({
      status,
      message,
      path:req.url,
      date: new Date().toLocaleDateString(),
    })
  }
}
