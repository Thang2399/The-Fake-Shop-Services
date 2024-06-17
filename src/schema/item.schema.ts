import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: '$' })
  currency: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  brandId: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  subCategoryId: string;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: false })
  isFavoriteItem: boolean;

  @Prop({ default: getCurrentDateTimeIsoString() }) // Set the default value to the current ISO date and time
  createdAt?: string;

  @Prop({ default: getCurrentDateTimeIsoString() })
  updatedAt?: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
