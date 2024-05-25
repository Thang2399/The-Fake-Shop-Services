import { Module } from '@nestjs/common';
import { StripeService } from './service/stripe.service';
import { StripeController } from '@/src/module/stripe/controller/stripe.controller';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';

@Module({
  imports: [ApiConfigModule],
  controllers: [StripeController],
  providers: [StripeService, ApiConfigServices],
})
export class StripeModule {}
