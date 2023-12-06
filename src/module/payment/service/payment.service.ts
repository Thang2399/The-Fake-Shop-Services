import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '@/src/module/payment/dto/create-payment.dto';
import { Request, Response } from 'express';
import { StripeService } from '@/src/module/stripe/service/stripe.service';
import { InvoiceService } from '@/src/module/invoice/service/invoice.service';
import { Payment_Status } from '@/src/module/invoice/enum/invoice.enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    @Inject(forwardRef(() => InvoiceService))
    private invoiceService: InvoiceService,
  ) {}

  async createPayment(dto: CreatePaymentDto, res: Response) {
    return await this.stripeService.createPayment(dto, res);
  }

  async getPaymentSuccessfully(req: Request, res: Response) {
    const invoiceId = req.query?.invoice_id.toString();
    const redirectUrl = req.query?.redirect_url?.toString() || '';
    const dto = {
      paymentNewStatus: Payment_Status.SUCCESS,
      isNewCreateInvoice: true,
      redirectUrl,
    };
    return this.invoiceService.updateInvoiceStatus(invoiceId, dto, res);
  }

  async getPaymentFailed(res: Response) {}
}
