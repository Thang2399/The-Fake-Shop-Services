import { Module } from '@nestjs/common';
import { InvoiceController } from './controller/invoice.controller';
import { InvoiceService } from './service/invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '@/src/schema/invoice.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { Item, ItemSchema } from '@/src/schema/item.schema';

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
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, ItemsServices],
})
export class InvoiceModule {}
