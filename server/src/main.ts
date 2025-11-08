import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://192.168.0.100:3000',
    optionSuccessStatus: 200,
    credentials: true,
  })
  app.use(cookieParser())

 const config = new DocumentBuilder()
    .setTitle('APC API')
    .setDescription('The APC API description')
    .setVersion('1.0')
    .addTag('APC')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
  jsonDocumentUrl: 'api/json',
  });

  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
