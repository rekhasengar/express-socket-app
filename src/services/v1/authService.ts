import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { UserModel } from '@src/database/mysql/models/userModel';
import CustomError from '@src/shared/errorHandler/customError';
import UserService from './userService';
import { generateJWT } from '@src/utils/jwt';
import { AUTH_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import { API_ROUTES, LOGS } from '@src/constants';
import EmailService from '@src/utils/email';
import { serverConfig } from '@src/config';
import {
  AuthChangedPasswordDto,
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthLogoutDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
} from '@src/dtos/authDto';
import { AuthLoginResponse, AuthResponse } from '@src/types/response/authResponse';

export default class AuthService {
  private readonly _userService: UserService;
  private readonly _emailService: EmailService;

  constructor() {
    this._userService = new UserService();
    this._emailService = new EmailService();
  }

  public async authRegister(authRegisterDto: AuthRegisterDto): Promise<AuthResponse> {
    const { firstName, lastName, email, password, context } = authRegisterDto;
    const user: UserModel | null = await this._userService.getUserByEmail(email);
    if (user) {
      throw CustomError.getConflictError(USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL);
    }

    const userModel: UserModel = new UserModel();
    userModel.firstName = firstName;
    userModel.lastName = lastName;
    userModel.email = email;
    userModel.password = password;
    await this._userService.createNewUser(userModel);

    context.logInfo({
      source: LOGS.GET_SOURCE(AuthService.name, this.authRegister.name),
      message: AUTH_MESSAGES.REGISTERED_SUCCESSFULLY,
    });
    return {
      message: AUTH_MESSAGES.REGISTERED_SUCCESSFULLY,
    };
  }

  public async userLogin(authLoginDto: AuthLoginDto): Promise<AuthLoginResponse> {
    const { email, password, context } = authLoginDto;

    const user: UserModel | null = await this._userService.getUserByEmail(email);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordMatched: boolean = await this._comparePassword(user.password, password);
    if (!isPasswordMatched) {
      throw CustomError.getUnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    await this._userService.updateUserByUserId(user.id, { isUserLoggedIn: true });
    const token: string = generateJWT({ id: user.id, email: user.email });
    context.logInfo({
      source: LOGS.GET_SOURCE(AuthService.name, this.userLogin.name),
      message: AUTH_MESSAGES.LOGGED_IN_SUCCESSFULLY,
    });
    return {
      token,
      message: AUTH_MESSAGES.LOGGED_IN_SUCCESSFULLY,
    };
  }

  public async userLogout(authLogoutDto: AuthLogoutDto): Promise<AuthResponse> {
    const { userId, context } = authLogoutDto;

    await this._userService.updateUserByUserId(userId, { isUserLoggedIn: false });
    context.logInfo({
      source: LOGS.GET_SOURCE(AuthService.name, this.userLogout.name),
      message: AUTH_MESSAGES.LOGGED_OUT_SUCCESSFULLY,
    });
    return {
      message: AUTH_MESSAGES.LOGGED_OUT_SUCCESSFULLY,
    };
  }

  public async forgotPassword(authForgotPasswordDto: AuthForgotPasswordDto): Promise<AuthResponse> {
    const { userId, context } = authForgotPasswordDto;

    const user = await this._userService.getUserByUserId(userId);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const token = randomBytes(6).toString('hex');
    const emailInfo = {
      to: user.email,
      subject: 'Reset Your Password',
      html: `Please use <a href="${serverConfig.APP_URL}/${API_ROUTES.AUTH}/password-reset?token=${token}">this link</a> to reset your password.`,
    };
    await Promise.all([
      this._userService.updateUserByUserId(user.id, { resetPasswordToken: token }),
      //TODO:REKHA-check why we are not able to send email
      this._emailService.sendEmail(emailInfo),
    ]);
    context.logInfo({
      source: LOGS.GET_SOURCE(AuthService.name, this.forgotPassword.name),
      message: AUTH_MESSAGES.RESET_PASSWORD_LINK_MAILED_SUCCESSFULLY,
    });
    return {
      message: AUTH_MESSAGES.RESET_PASSWORD_LINK_MAILED_SUCCESSFULLY,
    };
  }

  public async resetPassword(authResetPasswordDto: AuthResetPasswordDto): Promise<AuthResponse> {
    const { token, newPassword, context } = authResetPasswordDto;

    const user = await this._userService.getUserByResetPasswordToken(token);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }
    user.password = newPassword;
    await this._userService.saveUser(user);
    context.logInfo({
      source: LOGS.GET_SOURCE(AuthService.name, this.resetPassword.name),
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
    });
    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
    };
  }

  public async changePassword(authChangedPasswordDto: AuthChangedPasswordDto): Promise<AuthResponse> {
    const { oldPassword, newPassword, userId, context } = authChangedPasswordDto;

    const user = await this._userService.getUserByUserId(userId);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordMatched = await this._comparePassword(user.password, oldPassword);
    if (!isPasswordMatched) {
      throw CustomError.getUnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    user.password = newPassword;
    await this._userService.saveUser(user);

    context.logInfo({
      source: LOGS.GET_SOURCE(AuthService.name, this.resetPassword.name),
      message: AUTH_MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY,
    });
    return {
      message: AUTH_MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY,
    };
  }

  private async _comparePassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
