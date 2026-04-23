import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user.entity';
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

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER })
  @IsOptional()
  @IsString()
  @IsIn([UserRole.ADMIN, UserRole.USER])
  role?: UserRole;
}
