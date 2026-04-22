import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Acme Inc' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiProperty({ example: 'new', enum: ['new', 'contacted', 'qualified', 'won', 'lost'] })
  @IsString()
  @IsIn(['new', 'contacted', 'qualified', 'won', 'lost'])
  status!: string;

  @ApiProperty({ example: 1500, minimum: 0 })
  @IsInt()
  @Min(0)
  value!: number;

  @ApiProperty({ example: 'website' })
  @IsString()
  @IsNotEmpty()
  source!: string;
}
