import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema()
export class Brand {
  @Prop({ required: true, unique: true })
  brandName: string;

  @Prop({ required: true })
  brandSymbol: string;

  @Prop()
  brandIcon?: string;

  @Prop({ default: new Date().toISOString() }) // Set the default value to the current ISO date and time
  createdAt?: string;

  @Prop({ default: new Date().toISOString() })
  updatedAt?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
