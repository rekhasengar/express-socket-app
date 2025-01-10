import RolesEnum from '@src/enums/rolesEnum';
import { CreateRoleRequest } from '@src/types/request/roleRequest';

export class RoleDto {
  name: RolesEnum;
  description: string;

  constructor(body: CreateRoleRequest) {
    this.name = body.name;
    this.description = body.description.trim();
  }
}
