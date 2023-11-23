export interface IPurchaseItem {
  itemId: string;
  itemQuantity: number;
}

export interface IInvoice {
  userName: string;
  email: string;
  phoneNumber: string;
  paymentMethod?: string;
  shippingMethod?: string;
  shippingAddress?: string;
  discountCode?: string;
  listPurchaseItems: IPurchaseItem[];
}
