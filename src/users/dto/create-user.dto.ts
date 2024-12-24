import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'admin',
  })
  @IsOptional()
  username: string; // TODO: 也可能是一个 email

  @ApiProperty({
    type: String,
    example: 'admin@nest.js',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  @IsNotEmpty()
  password: string;
}
