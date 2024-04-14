import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { Promise } from 'bluebird'

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors:true });
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  // globalThis.Promise = Promise as unknown as typeof globalThis.Promise
  await app.listen(8000);
}
bootstrap();
