import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceDto } from '@/src/module/invoice/dto/create-invoice.dto';
import { InvoiceService } from '@/src/module/invoice/service/invoice.service';
import { Response } from 'express';
import { GetListInvoicesDto } from '@/src/module/invoice/dto/get-list-invoices.dto';
import { UpdateInvoiceStatusDto } from '@/src/module/invoice/dto/update-invoice-status.dto';

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
  @Get('')
  async getListInvoices(
    @Query() query: GetListInvoicesDto,
    @Res() res: Response,
  ) {
    return this.invoiceService.getListInvoices(query, res);
  }

  @ApiOperation({
    description: 'Get detail invoice',
  })
  @Get('/:id')
  async getDetailInvoice(@Param('id') id: string, @Res() res: Response) {
    return this.invoiceService.getDetailInvoice(id, res);
  }

  @ApiOperation({
    description: 'Update invoice status',
  })
  @ApiBody({
    type: UpdateInvoiceStatusDto,
  })
  @ApiParam({ name: 'id', description: 'Invoice Id', type: String })
  @Put('/:id')
  async updateInvoiceStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
    @Res() res: Response,
  ) {
    return this.invoiceService.updateInvoiceStatus(id, dto, res);
  }
}
