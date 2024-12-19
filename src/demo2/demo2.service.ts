import { Injectable } from '@nestjs/common';
import { CreateDemo2Dto } from './dto/create-demo2.dto';
import { UpdateDemo2Dto } from './dto/update-demo2.dto';

@Injectable()
export class Demo2Service {
  create(createDemo2Dto: CreateDemo2Dto) {
    return 'This action adds a new demo2';
  }

  findAll() {
    return `This action returns all demo2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demo2`;
  }

  update(id: number, updateDemo2Dto: UpdateDemo2Dto) {
    return `This action updates a #${id} demo2`;
  }

  remove(id: number) {
    return `This action removes a #${id} demo2`;
  }
}
