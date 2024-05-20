export enum PaginationOrderByValues {
  ASC = 'asc', // earliest => latest
  DESC = 'desc',
}

export enum PaginationFilterByRootId {
  TRUE = 'true',
  FALSE = 'false',
  DEFAULT = '',
}

export enum PaginationDefaultEnum {
  Current_Page = 1,
  Page_Size = 10,
  Search = '',
  OrderBy = PaginationOrderByValues.DESC,
  OrderType = 'updatedAt',
}
