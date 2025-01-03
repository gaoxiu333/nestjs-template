import { ApiProperty } from '@nestjs/swagger';

export class AuthForgotPasswordDto {
  @ApiProperty({
    example: 'admin',
    description: '用户名',
    type: String,
  })
  username: string;
}
