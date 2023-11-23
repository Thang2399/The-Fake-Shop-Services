import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceDto } from '@/src/module/invoice/dto/create-invoice.dto';
import { InvoiceService } from '@/src/module/invoice/service/invoice.service';
import { Response } from 'express';
import { GetListInvoicesDto } from '@/src/module/invoice/dto/get-list-invoices.dto';

@ApiTags('Invoice API')
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}
  @ApiOperation({
    description: 'Create invoice purchase order',
  })
  @ApiBody({
    type: CreateInvoiceDto,
  })
  @Post('')
  async createInvoice(@Body() dto: CreateInvoiceDto, @Res() res: Response) {
    return this.invoiceService.createInvoice(dto, res);
  }

  @ApiOperation({
    description: 'Get list invoice by email',
  })
  @Get()
  async getListInvoices(
    @Query() query: GetListInvoicesDto,
    @Res() res: Response,
  ) {
    return this.invoiceService.getListInvoices(query, res);
  }
}
