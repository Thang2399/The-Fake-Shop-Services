export const CREATE_ITEM_MESSAGE = {
  DUPLICATE_NAME: 'DUPLICATE_NAME',
};

export const GET_ITEM = {
  NOT_FOUND_ITEM: 'NOT_FOUND_ITEM',
};

export const ITEMS_MESSAGE = {
  CREATE_ITEM: { ...CREATE_ITEM_MESSAGE },
  GET_ITEM: { ...GET_ITEM },
};
