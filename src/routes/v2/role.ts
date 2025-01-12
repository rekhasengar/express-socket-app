import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { CreateRoleRequest } from '@src/types/request/roleRequest';
import { RoleResponse } from '@src/types/response/roleResponse';
import RoleContext from '@src/context/roleContext';
import { doValidation } from '@src/helpers/joiValidator';
import RoleSchema from '@src/helpers/joiValidator/schemas/role';

const roleRoute = Router();

roleRoute.post<PathParams, ResponseBody<RoleResponse>, RequestBody<CreateRoleRequest>, QueryParams>(
  '/create',
  doValidation(RoleSchema.AddRoleRequest),
  (...args): void => {
    RoleContext.getRoleController.addRole(...args);
  },
);

module.exports = { router: roleRoute, basePath: API_ROUTE.ROLES };
