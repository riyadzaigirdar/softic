import { config } from 'dotenv';
config();

import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import configuration from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ====================== CROSS ORIGIN POLICY ===================== //
  app.enableCors({
    allowedHeaders: '',
    origin: '*', // This might need to be changed into some specific values, rather than all
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Pipeline for validation of all inputs.
  // It will be transformed, and if implicit transformation can be done transform immediately.
  // The input data, which do not contain any validation decorator, of a validated object.
  // Exceptions are handled using exceptionFactory parameter
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        if (validationErrors[0].children.length)
          return new BadRequestException(
            Object.values(validationErrors[0].children[0].constraints)[0],
          );
        else
          return new BadRequestException(
            Object.values(validationErrors[0].constraints)[0],
          );
      },
    }),
  );

  // ===================== SET PREFIX ====================== //
  let endpointPrefix = '/api/v1/';

  app.setGlobalPrefix(endpointPrefix);

  const options = new DocumentBuilder()
    .setTitle('Swagger example')
    .setDescription('The supplier API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'authorization',
    )
    .addTag('supplier')

    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  // ===================== LOG APP STARTING ====================== //
  await app.listen(configuration.PORT);

  Logger.log(
    `App with endpoint '${endpointPrefix}' running on port ${configuration.PORT}`,
    'Softic Backend Api Service',
  );
}
bootstrap();
