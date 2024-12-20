import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { Demo2Service } from './demo2.service';
import { CreateDemo2Dto } from './dto/create-demo2.dto';
import { UpdateDemo2Dto } from './dto/update-demo2.dto';
import { SkipAuth } from 'src/auth/decorators/public.decorator';

@Controller('demo2')
export class Demo2Controller {
  constructor(private readonly demo2Service: Demo2Service) {}

  @SkipAuth()
  @Version('1')
  @Post()
  create(@Body() createDemo2Dto: CreateDemo2Dto) {
    return this.demo2Service.create(createDemo2Dto);
  }

  @Get()
  findAll() {
    return this.demo2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demo2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemo2Dto: UpdateDemo2Dto) {
    return this.demo2Service.update(+id, updateDemo2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demo2Service.remove(+id);
  }
}
