import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response';
import { GlobaExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGaurd } from './common/gaurds/jwt-auth';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGaurd(reflector));
  app.useGlobalFilters(new GlobaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
