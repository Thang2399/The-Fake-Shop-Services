import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ default: '$' })
  @IsString()
  @Expose()
  currency: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  @IsInt()
  @Expose()
  price: number;

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
  @IsNotEmpty()
  @IsString()
  @Expose()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  subCategoryId: string;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Expose()
  quantity: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Expose()
  isFavoriteItem: boolean;
}
