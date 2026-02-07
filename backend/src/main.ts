import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';
import { ActivityLogInterceptor } from './common/interceptors/activity-log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);


  app.setGlobalPrefix('api/v1');
  
  app.useGlobalInterceptors(app.get(ActivityLogInterceptor));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = new Reflector();
  app.useGlobalGuards(new AtGuard(reflector));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  //Comenta para dejar crear las tablas y luego descomenta para evitar que se creen cada vez
  await app.listen(process.env.PORT || 3000); 
}
bootstrap();
