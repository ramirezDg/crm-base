import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CRM API')
  .setDescription('Documentación de la API del CRM')
  .setVersion('1.0')
  .addCookieAuth('refreshToken')
  .build();