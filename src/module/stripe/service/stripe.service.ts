import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { CreatePaymentDto } from '@/src/module/payment/dto/create-payment.dto';
import { Response } from 'express';

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;
  constructor(private readonly apiConfigServices: ApiConfigServices) {
    this.stripe = new Stripe(this.apiConfigServices.getStripeSecretKey(), {
      apiVersion: '2023-10-16',
    });
  }

  async createPayment(dto: CreatePaymentDto, res: Response) {
    const { line_items, invoiceId, redirectUrl } = dto;
    const appDomain = this.apiConfigServices.getAppDomain();
    const port = this.apiConfigServices.getPort();
    const baseUrl = `${appDomain}${port}`;

    const session = await this.stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}&redirect_url=${redirectUrl}`,
      cancel_url: `${baseUrl}/payment/failed?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}&redirect_url=${redirectUrl}`,
    });

    const stripeUrl = session.url;
    const id = session.id;
    return res.send({
      success: true,
      session_id: id,
      redirect_url: stripeUrl,
    });
  }

  async handlePaymentSuccess(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    console.log('session', session);
  }
}
