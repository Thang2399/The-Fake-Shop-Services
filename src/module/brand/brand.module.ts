import { Module } from '@nestjs/common';
import { BrandController } from './controller/brand.controller';
import { BrandService } from './service/brand.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from '@/src/schema/brand.schema';
import { Item, ItemSchema } from '@/src/schema/item.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
      {
        name: Item.name,
        schema: ItemSchema,
      },
    ]),
    PaginationModule,
  ],
  controllers: [BrandController],
  providers: [BrandService, ItemsServices, PaginationService],
})
export class BrandModule {}
