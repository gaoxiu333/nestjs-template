import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig } from './config/app-config.type';
import { SuccessInterceptor } from './core/interceptor/success.interceptor';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 注册全局拦截器
  app.useGlobalInterceptors(new SuccessInterceptor(), new ErrorInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // 解决class-validator无法注入的问题
  const configService = app.get(ConfigService<AppConfig>);

  app.enableShutdownHooks(); // 优雅关闭

  /** 处理 prisma 错误 */
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  /** 通过配置文件设置全局前缀，实现版本管理 */
  app.setGlobalPrefix(configService.get('nest.apiPrefix', { infer: true }), {
    exclude: ['/'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConfig = configService.get('swagger', {
    infer: true,
  });
  const corsConfig = configService.get('cors', { infer: true });
  const nestConfig = configService.get('nest', { infer: true });
  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs Template')
      .setDescription(swaggerConfig.description || 'Nestjs Template Swagger')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path || 'docs', app, documentFactory);
  }

  // cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(nestConfig.port || 3000);
}
void bootstrap();
