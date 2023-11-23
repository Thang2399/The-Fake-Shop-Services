export enum Payment_Method_Enum {
  COD = 'cod',
  CARD = 'card',
  CASH = 'cash',
}

export enum Shipping_Method_Enum {
  AT_HOME = 'at_home',
  AT_STORE = 'at_store',
}

export enum Invoice_Status {
  RECEIVED_ORDER = 'received order',
  CHECKING_IN_STOCK = 'checking in stock',
  PREPARING_ITEMS = 'preparing items',
  PACKAGED_ITEMS = 'packaged items',
  DELIVERING = 'delivering',
  DELIVERED_SUCCESS = 'delivered successfully',
  DELIVERED_FAILED = 'delivered failed',
  FINISHED = 'finished',
}
