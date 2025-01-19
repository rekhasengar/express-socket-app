import { In, Repository } from 'typeorm';

import { UserModel } from '@src/database/mysql/models/userModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';
import { UpdateUserDto } from '@src/dtos/userDto';

export default class UserRepository {
  private _userModel: Repository<UserModel>;

  constructor() {
    this._userModel = AppDataSource.getRepository(UserModel);
  }

  public async getAllRegisterUserList(): Promise<Array<UserModel>> {
    return await this._userModel.find({
      where: {
        deleted: false,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        key: true,
        id: true,
      },
    });
  }

  public async getUserByUserId(userId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: { id: userId },
      relations,
    });
  }

  public async updateUserByUserId(userId: string, model: Partial<UserModel>): Promise<void> {
    await this._userModel.update({ id: userId }, model);
  }

  public async getAllUserByUserIds(userIds: Array<string>, relations?: Array<string>): Promise<Array<UserModel>> {
    return await this._userModel.find({
      where: {
        id: In(userIds),
      },
      relations,
    });
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: { email: email },
    });
  }

  public async saveUser(user: UserModel): Promise<UserModel> {
    return await this._userModel.save(user);
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userModel.insert(user);
  }

  public async getUserConversationsForGetConversationApi(userId: string): Promise<UserModel | null> {
    return await this._userModel.findOne({
      select: {
        key: true,
        conversationMembers: {
          key: true,
          conversation: {
            key: true,
            id: true,
            name: true,
            isGroupChat: true,
            members: {
              id: true,
              key: true,
              role: {
                key: true,
                name: true,
              },
              user: {
                key: true,
                id: true,
                firstName: true,
                lastName: true,
                sockets: {
                  socketId: true,
                },
              },
            },
          },
        },
      },
      where: { id: userId },
      relations: [
        'conversationMembers',
        'conversationMembers.conversation',
        'conversationMembers.conversation.members',
        'conversationMembers.conversation.members.role',
        'conversationMembers.conversation.members.user',
        'conversationMembers.conversation.members.user.sockets',
      ],
    });
  }

  public async getUserIdBySocketId(socketId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: {
        sockets: {
          socketId: socketId,
        },
      },
      relations,
    });
  }

  public async getUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: Array<string>,
  ): Promise<Array<UserModel>> {
    return await this._userModel.find({
      where: {
        conversationMembers: {
          conversation: {
            id: In([conversationIds]),
          },
        },
      },
      relations,
    });
  }

  public async getUserByUserIdAndConversationId(
    userId: string,
    conversationId: string,
    relations?: Array<string>,
  ): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: {
        id: userId,
        conversationMembers: {
          conversation: {
            id: conversationId,
          },
        },
      },
      relations,
    });
  }

  public async getLoggedInUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: Array<string>,
  ): Promise<Array<UserModel>> {
    return await this._userModel.find({
      where: {
        conversationMembers: {
          conversation: {
            id: In([conversationIds]),
          },
        },
        isUserLoggedIn: true,
      },
      relations,
    });
  }

  public async getUserByResetPasswordToken(token: string): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
  }

  public async getUser(userId: string): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: {
        id: userId,
      },
    });
  }

  public async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    await this._userModel.update(
      {
        id: updateUserDto.userId,
      },
      {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
      },
    );
  }

  public async deleteUser(userId: string): Promise<void> {
    await this._userModel.delete({
      id: userId,
    });
  }
}
