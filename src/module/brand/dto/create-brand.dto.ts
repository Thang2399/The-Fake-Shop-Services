import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ required: true })
  @IsString()
  brandName: string;

  @ApiProperty({ required: true })
  @IsString()
  brandSymbol: string;

  @ApiProperty()
  @IsString()
  brandIcon?: string;
}
