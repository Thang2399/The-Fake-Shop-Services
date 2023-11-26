import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBrandDto {
  @ApiProperty({ required: true })
  @IsString()
  brandName?: string;

  @ApiProperty({ required: true })
  @IsString()
  brandSymbol?: string;

  @ApiProperty()
  @IsString()
  brandIcon?: string;
}
