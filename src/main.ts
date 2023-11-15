import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiConfigServices } from './config/api/api-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ApiConfigServices);

  const port = configService.getPort();
  const version = configService.getVersion();

  const config = new DocumentBuilder()
    .setTitle('The Fake Shop base services')
    .setDescription('The Fake Shop base services API')
    .addBearerAuth()
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
