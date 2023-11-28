import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';

export type BrandDocument = HydratedDocument<Brand>;

@Schema()
export class Brand {
  @Prop({ required: true, unique: true })
  brandName: string;

  @Prop({ required: true })
  brandSymbol: string;

  @Prop()
  brandIcon?: string;

  @Prop({ default: getCurrentDateTimeIsoString() }) // Set the default value to the current ISO date and time
  createdAt?: string;

  @Prop({ default: getCurrentDateTimeIsoString() })
  updatedAt?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
