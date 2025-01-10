import AuthService from '@service/v2/authService';
import UserService from '@service/v2/userService';
import AuthController from '@src/controllers/v2/authController';
import UserRepository from '@src/repositories/v2/userRepository';

export default class AuthContext {
  public static get getAuthController(): AuthController {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const authService = new AuthService(userService);
    return new AuthController(authService);
  }
}
