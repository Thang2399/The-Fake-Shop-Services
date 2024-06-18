import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateUserAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  userName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  district?: string;

  @ApiProperty({ default: 'HN' })
  @IsString()
  @IsOptional()
  @Expose()
  city?: string;

  @ApiProperty({ default: 'VN' })
  @IsString()
  @IsOptional()
  @Expose()
  nation?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Expose()
  isDefaultAddress: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Expose()
  isWorkingAddress: boolean;
}
