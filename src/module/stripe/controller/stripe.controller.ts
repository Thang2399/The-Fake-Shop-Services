import {Body, Controller, Post, Res} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeService } from '@/src/module/stripe/service/stripe.service';
import { CreatePaymentDto } from '@/src/module/payment/dto/create-payment.dto';
import { Response } from 'express';

@ApiTags('Stripe Api')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @ApiOperation({
    description: 'Payment online with Stripe',
  })
  @ApiBody({
    type: CreatePaymentDto,
  })
  @Post('')
  async createPayment(@Body() dto: CreatePaymentDto, @Res() res: Response) {
    return this.stripeService.createPayment(dto, res);
  }
}
