import HttpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';

import UserRepository from '@src/repositories/v2/userRepository';
import CustomError from '@src/shared/errorHandler/customError';
import { ERROR_MESSAGES, SUCCESS_MESSAGE } from '@src/constants';
import UserRegisterDto from '@src/dtos/userRegisterDto';
import { UserModel } from '@src/database/mysql/models/userModel';
import { UserResponse } from '@src/types/response/userResponse';
import UserLoginDto from '@src/dtos/userLoginDto';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  public async registerUser(userRegisterDto: UserRegisterDto): Promise<UserResponse> {
    const userExists = await this._userRepository.getUserById({ email: userRegisterDto.email });
    if (userExists) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    const password = await this._convertPasswordIntoHash(userRegisterDto.password);
    const user = <UserModel>{
      firstName: userRegisterDto.firstName,
      lastName: userRegisterDto.lastName,
      email: userRegisterDto.email,
      password: password,
    };
    await this._userRepository.createNewUser(user);
    return {
      message: SUCCESS_MESSAGE.USER_REGISTER_SUCCESSFULLY,
    };
  }

  public async userLogin(userLoginDto: UserLoginDto): Promise<UserResponse> {
    const { email, password } = userLoginDto;
    const user = await this._userRepository.getUserById({ email: email });
    if (!user) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND(email));
    }
    const isPasswordMatched = await this._comparePassword(user.password, password);
    if (!isPasswordMatched) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    user.isLoginEnabled = true;
    await this._userRepository.saveUser(user);
    return {
      message: SUCCESS_MESSAGE.LOGIN_SUCCESSFULLY,
    };
  }

  public async getAllActiveUsers(): Promise<Array<UserModel>> {
    const users = await this._userRepository.getCurrentActiveAllUsers(
      { isLoginEnabled: true },
      { firstName: true, lastName: true },
    );
    if (!users) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.ACTIVE_USERS_NOT_FOUND);
    }
    return users;
  }

  private async _convertPasswordIntoHash(password: string): Promise<string> {
    const num = 10;
    return await bcrypt.hash(password, num);
  }
  private async _comparePassword(hashedPassword: string | null, plainPassword: string): Promise<boolean> {
    if (!hashedPassword) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_REGISTER);
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
