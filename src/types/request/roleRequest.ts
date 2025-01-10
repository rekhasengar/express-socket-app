import RolesEnum from '@src/enums/rolesEnum';

export type CreateRoleRequest = {
  name: RolesEnum;
  description: string;
};
