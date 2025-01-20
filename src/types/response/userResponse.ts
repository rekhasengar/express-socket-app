import { UserModel } from '@src/database/mysql/models/userModel';

export type GetAllUsersResponse = {
  users: Array<UserModel>;
};

export type GetSingleUserResponse = {
  user: UserModel;
};

export type UpdateUserResponse = {
  message: string;
};

export type DeleteUserResponse = {
  message: string;
};
