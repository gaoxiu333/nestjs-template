import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'admin',
  })
  @IsNotEmpty()
  username: string; // TODO: 也可能是一个 email

  @ApiProperty({
    type: String,
    example: '123456',
  })
  @IsNotEmpty()
  password: string;
}
