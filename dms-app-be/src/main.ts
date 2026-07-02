import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('DocVault  API')
    .setDescription('API for managing documents')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('api', app, document);

  // app.use(helmet());
  // app.use(compression());

  // app.setGlobalPrefix('api');
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
