import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateItemDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  currency?: string;

  @ApiProperty()
  @IsInt()
  @Expose()
  price?: number;

  @ApiProperty()
  @IsString()
  @Expose()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  brand?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  category?: string;

  @ApiProperty()
  @IsInt()
  @Expose()
  quantity?: number;
}
