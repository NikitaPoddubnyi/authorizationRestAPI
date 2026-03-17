import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import  cookieParser from 'cookie-parser';
import { setupSwagger } from './utils/swagger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser())
// 
// const document = new DocumentBuilder()
//   .setTitle('API autorization')
//   .setDescription('The API description')
//   .setVersion('1.0')
//   .build();

// const document = SwaggerModule.createDocument(app, config);
// SwaggerModule.setup('docs', app, document);
// 
//   
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();


