import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  Invoice_Status,
  Payment_Status,
} from '@/src/module/invoice/enum/invoice.enum';

export class UpdateInvoiceStatusDto {
  @IsEnum(Invoice_Status)
  @ApiProperty({
    required: false,
    enum: Invoice_Status,
    default: Invoice_Status.PREPARING_ITEMS,
  })
  invoiceNewStatus?: string;

  @ApiProperty({
    required: false,
    enum: Payment_Status,
    default: Payment_Status.PENDING,
  })
  @IsOptional()
  @IsString()
  paymentNewStatus?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isNewCreateInvoice?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  redirectUrl?: string = '';
}
