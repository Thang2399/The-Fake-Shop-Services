import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
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
  description?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  brandId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  categoryId?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  subCategoryId?: string;

  @ApiProperty()
  @IsInt()
  @Expose()
  quantity?: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Expose()
  isFavoriteItem: boolean;
}
