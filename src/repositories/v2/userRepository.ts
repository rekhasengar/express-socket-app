import { FindOptionsSelect, FindOptionsWhere, In, Repository } from 'typeorm';

import { UserModel } from '@src/database/mysql/models/userModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class UserRepository {
  private _userModel: Repository<UserModel>;

  constructor() {
    this._userModel = AppDataSource.getRepository(UserModel);
  }

  public async getCurrentActiveAllUsers(select: FindOptionsSelect<UserModel>): Promise<Array<UserModel>> {
    return await this._userModel.find({ select });
  }

  public async getUser(where: FindOptionsWhere<UserModel>): Promise<UserModel | null> {
    return await this._userModel.findOne({ where });
  }

  public async getUserByUserId(userId: string, relations?: string[]): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: { id: userId },
      relations,
    });
  }

  public async updateUserByUserId(where: FindOptionsWhere<UserModel>, data: Partial<UserModel>): Promise<void> {
    await this._userModel.update(where, data);
  }

  public async getAllUserByUserIds(userIds: Array<string>, relations?: string[]): Promise<Array<UserModel>> {
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

  public async getUserIdBySocketId(socketId: string, relations?: string[]): Promise<UserModel | null> {
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
    relations?: string[],
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

  public async getAllUsers(relations?: string[]): Promise<Array<UserModel>> {
    return await this._userModel.find({
      where: {},
      relations,
    });
  }
}
