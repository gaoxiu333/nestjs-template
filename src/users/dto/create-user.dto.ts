import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'userId',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
