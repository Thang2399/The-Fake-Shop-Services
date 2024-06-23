export enum Payment_Method_Enum {
  COD = 'cod',
  CARD = 'card',
}

export enum Payment_Status {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum Shipping_Method_Enum {
  AT_HOME = 'at-home',
  AT_STORE = 'at-store',
}

export enum Invoice_Status {
  RECEIVED_ORDER = 'RECEIVED_ORDER',
  PREPARING_ITEMS = 'PREPARING_ITEMS',
  DELIVERING = 'DELIVERING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED_OUT_OF_STOCK = 'CANCELED_OUT_OF_STOCK',
}
