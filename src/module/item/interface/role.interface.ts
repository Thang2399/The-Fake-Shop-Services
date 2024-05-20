import {
  Access_Right_Enum,
  Permission_Enum,
  User_Role_Enum,
} from '@/src/common/enum/user.enum';

export interface IRoleAccessRight {
  role: User_Role_Enum;
  accessRight: [
    {
      feature: Access_Right_Enum;
      permission: Permission_Enum[];
    },
  ];
}
