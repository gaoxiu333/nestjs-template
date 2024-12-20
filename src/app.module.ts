import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DemoModule } from './demo/demo.module';
import { Demo2Module } from './demo2/demo2.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig], // TODO: add env config file：https://docs.nestjs.com/techniques/configuration
      envFilePath: ['.env'],
    }),
    AuthModule,
    UsersModule,
    DemoModule,
    Demo2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
