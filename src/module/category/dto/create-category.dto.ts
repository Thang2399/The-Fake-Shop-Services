import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class SubCategory {
  @ApiProperty({ required: true })
  @IsString()
  categoryName: string;
}

export class CreateCategoryDto {
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
  subCategory?: SubCategory[] = [];
}
