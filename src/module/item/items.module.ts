import { Module } from '@nestjs/common';
import { ItemsController } from './controller/items.controller';
import { ItemsServices } from './service/items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from '@/src/schema/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Item.name,
        schema: ItemSchema,
      },
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsServices],
})
export class ItemsModule {}
