import { RoleModel } from '@src/database/mysql/models/roleModel';
import RolesEnum from '@src/enums/rolesEnum';
import RoleRepository from '@src/repositories/v1/roleRepository';

type RoleSeedData = {
  [key in RolesEnum]: {
    key: number;
    description: string;
  };
};

const rolesSeedData: RoleSeedData = {
  [RolesEnum.ADMIN]: {
    key: 1,
    description: 'This is the admin role.',
  },
  [RolesEnum.USER]: {
    key: 2,
    description: 'This is the user role.',
  },
};

export function getRoleKeyByName(name: RolesEnum): number {
  const roleSeedData = rolesSeedData[name];
  return roleSeedData.key;
}

export default async function processRoleSeeder(): Promise<void> {
  const roleModels: RoleModel[] = [];
  for (const [roleName, roleDetails] of Object.entries(rolesSeedData)) {
    const roleModel = new RoleModel();
    roleModel.key = roleDetails.key;
    roleModel.name = roleName as RolesEnum;
    roleModel.description = roleDetails.description;
    roleModels.push(roleModel);
  }

  const roleRepository = new RoleRepository();
  await roleRepository.addOrUpdateRoles(roleModels);
}
