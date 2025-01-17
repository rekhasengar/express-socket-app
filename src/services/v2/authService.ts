import HttpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { UserModel } from '@src/database/mysql/models/userModel';
import CustomError from '@src/shared/errorHandler/customError';
import { AuthResponse, UserLoginResponse } from '@src/types/response/userResponse';
import UserService from './userService';
import { UserRegisterDto, UserLoginDto, UserLogoutDto } from '@src/dtos/authDto';
import { generateJWT } from '@src/utils/jwt';
import { AUTH_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import { ACTION_MESSAGE, LOGS } from '@src/constants';
import { CustomErrorHandler } from '@src/helpers/customErrorHandler';
import { getMessage } from '@src/config/messages';

export default class AuthService {
  private readonly _userService: UserService;

  constructor() {
    this._userService = new UserService();
  }

  public async registerUser(userRegisterDto: UserRegisterDto): Promise<AuthResponse> {
    const { firstName, lastName, email, password, context, locale } = userRegisterDto;

    const userExists: UserModel | null = await this._userService.getUserByEmail(email);
    if (userExists) {
      context.logError({
        source: LOGS.SUCCESS_MESSAGE(AuthService.name, this.registerUser.name),
        action: USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL,
        message: getMessage(USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL),
      });
      const message: string = getMessage(USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL, locale);
      throw new CustomErrorHandler(
        HttpStatusCode.BAD_REQUEST,
        message,
        USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL,
      );
    }

    const userModel: UserModel = new UserModel();
    userModel.firstName = firstName;
    userModel.lastName = lastName;
    userModel.email = email;
    userModel.password = password;

    await this._userService.createNewUser(userModel);
    context.logInfo({
      source: LOGS.ERROR_MESSAGE(AuthService.name, this.registerUser.name),
      action: AUTH_MESSAGES.REGISTERED_SUCCESSFULLY,
      message: ACTION_MESSAGE.REGISTER_PROCESS,
    });

    return {
      message: AUTH_MESSAGES.REGISTERED_SUCCESSFULLY,
    };
  }

  public async userLogin(userLoginDto: UserLoginDto): Promise<UserLoginResponse> {
    const { email, password, context, locale } = userLoginDto;

    const user: UserModel | null = await this._userService.getUserByEmail(email);
    if (!user) {
      context.logError({
        source: LOGS.ERROR_MESSAGE(AuthService.name, this.userLogin.name),
        action: USER_MESSAGES.USER_NOT_FOUND,
        message: getMessage(USER_MESSAGES.USER_NOT_FOUND),
      });
      const message: string = getMessage(USER_MESSAGES.USER_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.BAD_REQUEST, message, USER_MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordMatched: boolean = await this._comparePassword(user.password, password);
    if (!isPasswordMatched) {
      context.logError({
        source: LOGS.ERROR_MESSAGE(AuthService.name, this.userLogin.name),
        action: AUTH_MESSAGES.INVALID_CREDENTIALS,
        message: getMessage(AUTH_MESSAGES.INVALID_CREDENTIALS),
      });
      const message: string = getMessage(AUTH_MESSAGES.INVALID_CREDENTIALS, locale);
      throw new CustomErrorHandler(HttpStatusCode.UNAUTHORIZED, message, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    user.isLoginEnabled = true;
    const savedUser: UserModel = await this._userService.saveUser(user);
    const token: string = generateJWT({ id: savedUser.id, email: savedUser.email });
    context.logInfo({
      source: LOGS.SUCCESS_MESSAGE(AuthService.name, this.userLogin.name),
      action: ACTION_MESSAGE.LOGIN_PROCESS,
      message: ACTION_MESSAGE.LOGIN_PROCESS,
    });
    return {
      token,
      message: AUTH_MESSAGES.LOGGED_IN_SUCCESSFULLY,
    };
  }

  public async userLogout(userLogoutDto: UserLogoutDto): Promise<AuthResponse> {
    const { userId, context } = userLogoutDto;

    await this._userService.updateUserByUserId(userId);

    context.logInfo({
      source: LOGS.SUCCESS_MESSAGE(AuthService.name, this.userLogout.name),
      action: ACTION_MESSAGE.LOGOUT_PROCESS,
      message: getMessage(ACTION_MESSAGE.LOGIN_PROCESS),
    });
    return {
      message: AUTH_MESSAGES.LOGGED_OUT_SUCCESSFULLY,
    };
  }

  private async _comparePassword(hashedPassword: string | null, plainPassword: string): Promise<boolean> {
    if (!hashedPassword) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.USER_NOT_REGISTER);
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
