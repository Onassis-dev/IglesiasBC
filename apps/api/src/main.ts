import { generateOpenApi } from '@ts-rest/open-api';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationFilter } from './interceptors/validation/validation.filter';
import fastifyCookie from '@fastify/cookie';
import { DBFilter } from './interceptors/db/db.filter';
import { contract } from '@iglesiasbc/schemas';
import * as dotenv from 'dotenv';
dotenv.config();
process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      rawBody: true,
    },
  );

  //protection
  app.enableCors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
  });

  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalFilters(new DBFilter());

  //middleware
  await app.register(fastifyCookie as any);

  //swagger implementation
  const document = generateOpenApi(contract, {
    info: {
      title: 'IglesiasBC',
      version: '1.0',
    },
  });
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
