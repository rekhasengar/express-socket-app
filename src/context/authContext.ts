import AuthService from '@service/v2/authService';
import UserService from '@service/v2/userService';
import AuthController from '@src/controllers/v2/authController';

export default class AuthContext {
  public static get getAuthController(): AuthController {
    const userService = new UserService();
    const authService = new AuthService(userService);
    return new AuthController(authService);
  }
}
