import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from '@/src/module/payment/service/payment.service';
import { Request, Response } from 'express';
import { CreatePaymentDto } from '@/src/module/payment/dto/create-payment.dto';

@ApiTags('Payment Api')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    description: 'Create payment',
  })
  @ApiBody({
    type: CreatePaymentDto,
  })
  @Post('')
  async createPayment(@Body() dto: CreatePaymentDto, @Res() res: Response) {
    return this.paymentService.createPayment(dto, res);
  }

  @ApiOperation({
    description: 'Get payment successfully',
  })
  @Get('/success')
  async getPaymentSuccessfully(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.getPaymentSuccessfully(req, res);
  }

  @ApiOperation({
    description: 'Get payment failed',
  })
  @Get('/failed')
  async getPaymentFailed(@Res() res: Response) {
    return this.paymentService.getPaymentFailed(res);
  }
}
