import { Module } from '@nestjs/common';
import { ItemsController } from './controller/items.controller';
import { ItemsServices } from './service/items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from '@/src/schema/item.schema';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Item.name,
        schema: ItemSchema,
      },
    ]),
    PaginationModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsServices, PaginationService],
})
export class ItemsModule {}
