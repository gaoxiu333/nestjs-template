import { ApiProperty } from "@nestjs/swagger";

export class CreateDemoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}
