import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import {
  PaginationDefaultEnum,
  PaginationOrderByValues,
} from '@/src/shared/module/pagination/enum/pagination.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(PaginationDefaultEnum.Current_Page)
  @ApiProperty({
    type: Number,
    default: PaginationDefaultEnum.Current_Page,
    required: false,
  })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(PaginationDefaultEnum.Page_Size)
  @ApiProperty({
    type: Number,
    default: PaginationDefaultEnum.Page_Size,
    required: false,
  })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: PaginationDefaultEnum.Search,
    required: false,
  })
  search?: string;

  @IsOptional()
  @IsEnum(PaginationOrderByValues)
  @ApiProperty({
    enum: PaginationOrderByValues,
    default: PaginationDefaultEnum.OrderBy,
    required: false,
  })
  orderBy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: PaginationDefaultEnum.OrderType,
    required: false,
  })
  @IsOptional()
  orderType?: string;
}
