import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DemoModule } from './demo/demo.module';
import { Demo2Module } from './demo2/demo2.module';
import appConfig from './config/app.config';
import { loggerConfig } from './config/logger.config';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig], // TODO: add env config file：https://docs.nestjs.com/techniques/configuration
      envFilePath: ['.env'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // TODO: add prisma middleware
          loggingMiddleware({
            logger: new Logger('Prisma'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    AuthModule,
    UsersModule,
    DemoModule,
    Demo2Module,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
