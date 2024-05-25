import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductData {
  @ApiProperty({ required: true })
  name: string;
}

export class PriceData {
  @ApiProperty({ default: 'usd' })
  currency: string;

  @ApiProperty({ required: true })
  unit_amount: number;

  @ApiProperty({ required: true })
  product_data: ProductData;
}

export class LineItem {
  @ApiProperty({ required: true })
  price_data: PriceData;

  @ApiProperty({ required: true })
  quantity: number;
}
export class CreatePaymentDto {
  @ApiProperty({ required: true })
  invoiceId: string;

  @ApiProperty({ required: true })
  totalInvoicePrice: number;

  @ApiProperty({ type: () => [LineItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItem)
  line_items: LineItem[];

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  redirectUrl?: string = '';
}
