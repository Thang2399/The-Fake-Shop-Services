import { Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '@/src/schema/category.schema';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { Brand, BrandSchema } from '@/src/schema/brand.schema';
import { Item, ItemSchema } from '@/src/schema/item.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
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
  controllers: [CategoryController],
  providers: [CategoryService, ItemsServices, PaginationService],
})
export class CategoryModule {}
