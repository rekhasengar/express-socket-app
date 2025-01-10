import EventEnum from '@src/enums/eventEnum';

export type BaseRequest = {
  eventType: EventEnum;
  socketId: string;
  data: DataRequest;
};

export type DataRequest = {
  adminId: number;
  userId: number;
  roleId: number;
  conversationId: number;
};
