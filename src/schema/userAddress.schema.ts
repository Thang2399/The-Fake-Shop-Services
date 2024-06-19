import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserAddressDocument = HydratedDocument<UserAddress>;

@Schema()
export class UserAddress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  nation: string;

  @Prop({ default: true })
  isDefaultAddress: boolean;

  @Prop({ default: false })
  isWorkingAddress: boolean;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
