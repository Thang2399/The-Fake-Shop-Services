import { PaginationDto } from '@/src/common/dto/pagination.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetListInvoicesDto extends PaginationDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phoneNumber?: string = '';
}
