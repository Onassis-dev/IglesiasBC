import { apiReference } from '@scalar/nestjs-api-reference';
import { generateOpenApi } from '@ts-rest/open-api';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization'],
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

  app.use(
    '/docs',
    apiReference({
      withFastify: true,
      hideClientButton: false,
      showSidebar: true,
      theme: 'none',
      layout: 'modern',
      isEditable: false,
      hideModels: false,
      hideDownloadButton: true,
      hideTestRequestButton: true,
      hideSearch: false,
      hideDarkModeToggle: false,
      withDefaultFonts: true,
      content: document,
    }),
  );

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
