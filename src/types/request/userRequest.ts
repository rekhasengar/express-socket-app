export type UserRegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserLogoutPathRequest = {
  userId: string;
};
