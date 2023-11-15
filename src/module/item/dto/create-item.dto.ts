import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ default: '$' })
  @IsString()
  @Expose()
  currency: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  @IsInt()
  @Expose()
  price: number;

  @ApiProperty()
  @IsString()
  @Expose()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  brand: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  category: string;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Expose()
  quantity: number;
}
