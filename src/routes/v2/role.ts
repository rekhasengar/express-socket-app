import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { CreateRoleRequest } from '@src/types/request/roleRequest';
import { RoleResponse } from '@src/types/response/roleResponse';
import RoleContext from '@src/context/roleContext';

const roleRoute = Router();

roleRoute.post<PathParams, ResponseBody<RoleResponse>, RequestBody<CreateRoleRequest>, QueryParams>(
  '/create',
  (...args): void => {
    RoleContext.getRoleController.addRole(...args);
  },
);

module.exports = { router: roleRoute, basePath: API_ROUTE.ROLES };
