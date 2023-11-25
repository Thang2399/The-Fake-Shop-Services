import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Invoice_Status } from '@/src/module/invoice/enum/invoice.enum';

export class UpdateInvoiceStatusDto {
  @IsEnum(Invoice_Status)
  @ApiProperty({
    required: true,
    enum: Invoice_Status,
    default: Invoice_Status.PREPARING_ITEMS,
  })
  invoiceNewStatus: string;
}
