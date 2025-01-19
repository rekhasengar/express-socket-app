export type AuthRegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type AuthChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};
