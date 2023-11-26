import { Module } from '@nestjs/common';
import { InvoiceController } from './controller/invoice.controller';
import { InvoiceService } from './service/invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '@/src/schema/invoice.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { Item, ItemSchema } from '@/src/schema/item.schema';
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
    PaginationModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, ItemsServices, PaginationService],
})
export class InvoiceModule {}
