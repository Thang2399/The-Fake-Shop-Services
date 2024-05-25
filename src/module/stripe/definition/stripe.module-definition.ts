import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IStripeModuleOptions } from '@/src/module/stripe/interface/stripe-module-option.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IStripeModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
