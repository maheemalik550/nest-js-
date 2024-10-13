import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('My NestJS API')
  .setDescription('API documentation for my NestJS project')
  .setVersion('1.0')
  .addTag('users') // You can add multiple tags
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
