import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryId {
  @ApiProperty({ required: true })
  @IsString()
  categoryId: string;
}

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

  @ApiProperty({ type: () => [CategoryId] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryId)
  categoryIdList?: CategoryId[] = [];
}
