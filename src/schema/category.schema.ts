import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '@/src/schema/abstract.schema';

export type CategoryDocument = HydratedDocument<Category>;

export class SubCategory {
  @Prop()
  subCategoryName?: string;

  @Prop()
  subCategoryId?: string;
}

@Schema()
export class Category extends AbstractSchema {
  @Prop({ required: true, unique: true })
  categoryName: string;

  @Prop()
  rootCategoryId?: string;

  @Prop({ type: [SubCategory], default: [] })
  subCategories?: SubCategory[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
