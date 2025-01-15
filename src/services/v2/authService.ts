import HttpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { UserModel } from '@src/database/mysql/models/userModel';
import CustomError from '@src/shared/errorHandler/customError';
import { AuthResponse, UserLoginResponse } from '@src/types/response/userResponse';
import UserService from './userService';
import { UserRegisterDto, UserLoginDto, UserLogoutDto } from '@src/dtos/authDto';
import { generateJWT } from '@src/utils/jwt';
import RequestContext from '@src/helpers/context';
import { AUTH_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import { CONTROLLER_LOGS_MESSAGE, LOGS, LOGS_ACTIONS } from '@src/constants';

export default class AuthService {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  public async registerUser(userRegisterDto: UserRegisterDto, context: RequestContext): Promise<AuthResponse> {
    const userExists = await this._userService.getUserByEmail(userRegisterDto.email);
    if (userExists) {
      context.logError({
        message: USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL,
        source: LOGS.SUCCESS_MESSAGE(AuthService.name, this.registerUser.name),
        action: LOGS_ACTIONS.AUTH,
      });
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL);
    }
    const userModel = new UserModel();
    userModel.firstName = userRegisterDto.firstName;
    userModel.lastName = userRegisterDto.lastName;
    userModel.email = userRegisterDto.email;
    userModel.password = userRegisterDto.password;

    await this._userService.createNewUser(userModel);
    context.logInfo({
      message: CONTROLLER_LOGS_MESSAGE.REGISTER_PROCESS_COMPLETED,
      source: LOGS.ERROR_MESSAGE(AuthService.name, this.registerUser.name),
      action: LOGS_ACTIONS.AUTH,
    });
    return {
      message: AUTH_MESSAGES.REGISTERED_SUCCESSFULLY,
    };
  }

  public async userLogin(userLoginDto: UserLoginDto, context: RequestContext): Promise<UserLoginResponse> {
    const { email, password } = userLoginDto;
    const user = await this._userService.getUserByEmail(email);
    if (!user) {
      context.logError({
        message: USER_MESSAGES.USER_NOT_FOUND_WITH_EMAIL,
        source: LOGS.ERROR_MESSAGE(AuthService.name, this.userLogin.name),
        action: LOGS_ACTIONS.AUTH,
      });
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.USER_NOT_FOUND_WITH_EMAIL);
    }
    const isPasswordMatched = await this._comparePassword(user.password, password);
    if (!isPasswordMatched) {
      context.logError({
        message: AUTH_MESSAGES.INVALID_CREDENTIALS,
        source: LOGS.ERROR_MESSAGE(AuthService.name, this.userLogin.name),
        action: LOGS_ACTIONS.AUTH,
      });
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    user.isLoginEnabled = true;
    const savedUser = await this._userService.saveUser(user);
    const token = generateJWT({ id: savedUser.id, email: savedUser.email });
    context.logInfo({
      message: CONTROLLER_LOGS_MESSAGE.LOGOUT_PROCESS_COMPLETED,
      source: LOGS.SUCCESS_MESSAGE(AuthService.name, this.userLogin.name),
      action: LOGS_ACTIONS.AUTH,
    });
    return {
      token,
      message: AUTH_MESSAGES.LOGGED_IN_SUCCESSFULLY,
    };
  }

  public async userLogout(userLogoutDto: UserLogoutDto, context: RequestContext): Promise<AuthResponse> {
    await this._userService.updateUserByUserId(userLogoutDto.userId);

    context.logInfo({
      message: CONTROLLER_LOGS_MESSAGE.LOGIN_PROCESS_COMPLETED,
      source: LOGS.SUCCESS_MESSAGE(AuthService.name, this.userLogout.name),
      action: LOGS_ACTIONS.AUTH,
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
