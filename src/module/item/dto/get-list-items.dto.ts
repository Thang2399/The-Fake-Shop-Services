import { PaginationDto } from '@/src/shared/module/pagination/dto/pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FilterIsFavoriteItem } from '@/src/module/item/enum/item.enum';

export class GetListItemsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(FilterIsFavoriteItem)
  @ApiProperty({
    enum: FilterIsFavoriteItem,
    default: FilterIsFavoriteItem.DEFAULT,
    required: false,
  })
  isFilterFavoriteItems?: string;
}
