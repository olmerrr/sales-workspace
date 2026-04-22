import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: 'Dominic' })
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name!: string;

  @ApiProperty({ example: 'Backend developer' })
  @IsString({
    message: 'BIO must be a string',
  })
  @IsNotEmpty({
    message: 'BIO is required',
  })
  bio!: string;
}
