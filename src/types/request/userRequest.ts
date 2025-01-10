export type UserRegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};
