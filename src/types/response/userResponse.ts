import { UserModel } from '@src/database/mysql/models/userModel';
import UserStatusEnum from '@src/enums/userStatusEnum';

export type AuthResponse = {
  message: string;
};

export type UserLoginResponse = {
  token: string;
  message: string;
};

export type GetActiveUsersResponse = {
  users: Array<UserModel>;
};

export type UserStatusResponse = {
  userId: number;
  status: UserStatusEnum;
};

export type GetUserStatusResponse = {
  status: Array<UserStatusResponse>;
};
