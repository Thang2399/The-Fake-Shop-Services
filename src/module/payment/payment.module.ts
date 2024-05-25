import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';
import { StripeModule } from '@/src/module/stripe/stripe.module';
import { StripeService } from '@/src/module/stripe/service/stripe.service';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { InvoiceModule } from '@/src/module/invoice/invoice.module';
import { InvoiceService } from '@/src/module/invoice/service/invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '@/src/schema/invoice.schema';
import { Item, ItemSchema } from '@/src/schema/item.schema';
import { ItemsModule } from '@/src/module/item/items.module';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
      {
        name: Item.name,
        schema: ItemSchema,
      },
    ]),
    ApiConfigModule,
    forwardRef(() => StripeModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => PaginationModule),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    ApiConfigServices,
    InvoiceService,
    ItemsServices,
    PaginationService,
  ],
})
export class PaymentModule {}
