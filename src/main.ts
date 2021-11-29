import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const servicePort = configService.get('PORT');
  const port = servicePort ? servicePort : 3000;

  await app
    .listen(port)
    .then(() => console.log(`Service Started and Listening on Port=${port}`));
}
bootstrap();
