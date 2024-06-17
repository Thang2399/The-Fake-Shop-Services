import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class SubCategory {
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  subCategoryId: string;
}

export class Brand {
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  brandId: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  categoryName: string;

  @ApiProperty()
  @IsString()
  rootCategoryId?: string = '';

  @ApiProperty({ type: () => [SubCategory] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCategory)
  subCategories?: SubCategory[] = [];

  @ApiProperty({ type: () => [Brand] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Brand)
  brands?: Brand[] = [];
}
