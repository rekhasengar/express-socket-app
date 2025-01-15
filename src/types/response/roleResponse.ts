import RolesEnum from '@src/enums/rolesEnum';

export type UserRole = {
  key: number;
  name: RolesEnum;
};

export type RoleResponse = {
  roles: Array<UserRole>;
};
