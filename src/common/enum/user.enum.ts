export enum User_Role_Enum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  SALE = 'sale',
}

export enum Permission_Enum {
  CREATE = 'create',
  UPDATE = 'update',
  READ = 'read',
  DELETE = 'delete',
}

export enum Access_Right_Enum {
  USER = 'user',
  ITEM = 'item',
  BRAND = 'brand',
  CATEGORY = 'category',
  INVOICE = 'invoice',
}

export const roleAccessRight = [
  {
    role: User_Role_Enum.SUPER_ADMIN,
    accessRight: [
      {
        feature: Access_Right_Enum.USER,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.ITEM,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.BRAND,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.CATEGORY,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.INVOICE,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
    ],
  },
  {
    role: User_Role_Enum.ADMIN,
    accessRight: [
      {
        feature: Access_Right_Enum.USER,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.ITEM,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.BRAND,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.CATEGORY,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.INVOICE,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
    ],
  },
  {
    role: User_Role_Enum.USER,
    accessRight: [
      {
        feature: Access_Right_Enum.USER,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
          Permission_Enum.DELETE,
        ],
      },
      {
        feature: Access_Right_Enum.ITEM,
        permission: [Permission_Enum.READ],
      },
      {
        feature: Access_Right_Enum.BRAND,
        permission: [Permission_Enum.READ],
      },
      {
        feature: Access_Right_Enum.CATEGORY,
        permission: [Permission_Enum.READ],
      },
      {
        feature: Access_Right_Enum.INVOICE,
        permission: [
          Permission_Enum.CREATE,
          Permission_Enum.UPDATE,
          Permission_Enum.READ,
        ],
      },
    ],
  },
];
