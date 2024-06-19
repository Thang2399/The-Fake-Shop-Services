import { PaginationDto } from '@/src/shared/module/pagination/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListUserAddressesDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string = '';
}
