import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { RoleResponse } from '@src/types/response/roleResponse';
import RoleController from '@src/controllers/v2/roleController';

const roleRoute = Router();
const roleController = new RoleController();

roleRoute.get<PathParams, ResponseBody<RoleResponse>, RequestBody, QueryParams>('/', (...args): void => {
  roleController.getAllRoles(...args);
});

module.exports = { router: roleRoute, basePath: API_ROUTE.ROLES };
