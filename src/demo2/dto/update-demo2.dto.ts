import { PartialType } from '@nestjs/swagger';
import { CreateDemo2Dto } from './create-demo2.dto';

export class UpdateDemo2Dto extends PartialType(CreateDemo2Dto) {}
