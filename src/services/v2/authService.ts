import HttpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { ERROR_MESSAGES, SUCCESS_MESSAGE } from '@src/constants';
import { UserModel } from '@src/database/mysql/models/userModel';
import CustomError from '@src/shared/errorHandler/customError';
import { RegisterUserResponse } from '@src/types/response/userResponse';
import UserService from './userService';
import { UserRegisterDto, UserLoginDto } from '@src/dtos/authDto';

export default class AuthService {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  public async registerUser(userRegisterDto: UserRegisterDto): Promise<RegisterUserResponse> {
    const userExists = await this._userService.getUserByEmail(userRegisterDto.email);
    if (userExists) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_ALREADY_EXISTS_WITH_THIS_EMAIL);
    }
    const userModel = new UserModel();
    userModel.firstName = userRegisterDto.firstName;
    userModel.lastName = userRegisterDto.lastName;
    userModel.email = userRegisterDto.email;
    userModel.password = userRegisterDto.password;

    await this._userService.createNewUser(userModel);
    return {
      message: SUCCESS_MESSAGE.USER_REGISTER_SUCCESSFULLY,
    };
  }

  public async userLogin(userLoginDto: UserLoginDto): Promise<RegisterUserResponse> {
    const { email, password } = userLoginDto;
    const user = await this._userService.getUserByEmail(email);
    if (!user) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND(email));
    }
    const isPasswordMatched = await this._comparePassword(user.password, password);
    if (!isPasswordMatched) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    user.isLoginEnabled = true;
    await this._userService.saveUser(user);
    return {
      message: SUCCESS_MESSAGE.LOGIN_SUCCESSFULLY,
    };
  }

  private async _comparePassword(hashedPassword: string | null, plainPassword: string): Promise<boolean> {
    if (!hashedPassword) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_REGISTER);
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
