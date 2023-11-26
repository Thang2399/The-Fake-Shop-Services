import { Module } from '@nestjs/common';
import { PaginationService } from './service/pagination.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from '@/src/schema/brand.schema';
import { Item, ItemSchema } from '@/src/schema/item.schema';
import { Invoice, InvoiceSchema } from '@/src/schema/invoice.schema';

@Module({
  imports: [],
  providers: [PaginationService],
})
export class PaginationModule {}
