import { PaginationDto } from '@/src/shared/module/pagination/dto/pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationFilterByRootId } from '@/src/shared/module/pagination/enum/pagination.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetCategoriesWithTypicalItemsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PaginationFilterByRootId)
  @ApiProperty({
    enum: PaginationFilterByRootId,
    default: PaginationFilterByRootId.TRUE,
    required: false,
  })
  filterByRootId?: string;
}
