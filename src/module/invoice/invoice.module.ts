import { forwardRef, Module } from '@nestjs/common';
import { InvoiceController } from './controller/invoice.controller';
import { InvoiceService } from './service/invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '@/src/schema/invoice.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { Item, ItemSchema } from '@/src/schema/item.schema';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { PaymentModule } from '@/src/module/payment/payment.module';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { PaymentService } from '@/src/module/payment/service/payment.service';
import { StripeModule } from '@/src/module/stripe/stripe.module';
import { StripeService } from '@/src/module/stripe/service/stripe.service';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { ItemsModule } from '@/src/module/item/items.module';

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
    PaginationModule,
    forwardRef(() => PaymentModule),
    forwardRef(() => StripeModule),
    forwardRef(() => ItemsModule),
    ApiConfigModule,
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    ItemsServices,
    PaginationService,
    PaymentService,
    StripeService,
    ApiConfigServices,
  ],
  exports: [InvoiceService],
})
export class InvoiceModule {}
