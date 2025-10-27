import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:'*',           //access-control-allow-credentials:true
    optionSuccessStatus:200,
  })
  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
