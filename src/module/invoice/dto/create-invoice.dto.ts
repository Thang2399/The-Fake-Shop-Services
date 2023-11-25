import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
  Payment_Method_Enum,
  Shipping_Method_Enum,
} from '@/src/module/invoice/enum/invoice.enum';

export class PurchaseItem {
  @ApiProperty({ required: true })
  @IsString()
  itemId: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  itemQuantity: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userName: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  phoneNumber: string;

  @IsEnum(Payment_Method_Enum)
  @ApiProperty({
    enum: Payment_Method_Enum,
    default: Payment_Method_Enum.CARD,
    required: true,
  })
  paymentMethod: string;

  @IsEnum(Shipping_Method_Enum)
  @ApiProperty({
    enum: Shipping_Method_Enum,
    default: Shipping_Method_Enum.AT_HOME,
    required: true,
  })
  shippingMethod: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  discountCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ type: () => [PurchaseItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItem)
  listPurchaseItems: PurchaseItem[];
}
