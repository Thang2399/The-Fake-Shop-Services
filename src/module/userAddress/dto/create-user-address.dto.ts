import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  district: string;

  @ApiProperty({ default: 'HN' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  city: string;

  @ApiProperty({ default: 'VN' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  nation: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Expose()
  isDefaultAddress: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Expose()
  isWorkingAddress: boolean;
}
