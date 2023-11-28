import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Invoice_Status,
  Payment_Method_Enum,
  Shipping_Method_Enum,
} from '@/src/module/invoice/enum/invoice.enum';
import {getCurrentDateTimeIsoString} from "@/src/common/utils";

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop({ required: true })
  invoiceId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: Payment_Method_Enum.CARD })
  paymentMethod?: string;

  @Prop({ default: Shipping_Method_Enum.AT_HOME })
  shippingMethod?: string;

  @Prop()
  discountCode?: string;

  @Prop()
  shippingAddress?: string;

  @Prop()
  listPurchaseItems: { itemId: string; itemQuantity: number }[];

  @Prop({ default: Invoice_Status.RECEIVED_ORDER })
  invoiceStatus: string;

  @Prop({ default: getCurrentDateTimeIsoString() }) // Set the default value to the current ISO date and time
  createdAt?: string;

  @Prop({ default: getCurrentDateTimeIsoString() })
  updatedAt?: string;

  @Prop({ default: '' })
  deletedAt?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
