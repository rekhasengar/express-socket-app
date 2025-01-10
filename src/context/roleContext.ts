import RoleService from '@service/v2/roleService';
import RoleController from '@src/controllers/v2/roleController';
import RoleRepository from '@src/repositories/v2/roleRepository';

export default class RoleContext {
  public static get getRoleController(): RoleController {
    const roleRepository = new RoleRepository();
    const roleService = new RoleService(roleRepository);
    return new RoleController(roleService);
  }
}
