import { Module } from '@nestjs/common';
import { Demo2Service } from './demo2.service';
import { Demo2Controller } from './demo2.controller';

@Module({
  controllers: [Demo2Controller],
  providers: [Demo2Service],
})
export class Demo2Module {}
