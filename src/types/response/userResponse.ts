import { UserModel } from '@src/database/mysql/models/userModel';
import UserStatusEnum from '@src/enums/userStatusEnum';

export type GetAllUsersResponse = {
  users: Array<UserModel>;
};

export type UserStatusResponse = {
  userId: number;
  status: UserStatusEnum;
};

export type GetUserStatusResponse = {
  status: Array<UserStatusResponse>;
};

export type GetUserResponse = {
  message: string;
};

export type UpdateUserResponse = {
  message: string;
};

export type DeleteUserResponse = {
  message: string;
};
