import Stripe from 'stripe';

export interface IStripeModuleOptions {
  apiKey: string;
  options: Stripe.StripeConfig;
}
