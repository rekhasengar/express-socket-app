import { UserModel } from '@src/database/mysql/models/userModel';

export type GetAllUsersResponse = {
  users: Array<UserModel>;
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
