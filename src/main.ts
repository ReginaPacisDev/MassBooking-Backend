import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://massbookingreginapaciscc.org'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  app.use(helmet());

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;

  await app.listen(port);

  Logger.log(`🚀 base API is running on port ${port}`);
}

bootstrap();
