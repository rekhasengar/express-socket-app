export = {
  ConversationCreatedResponse: {
    200: {
      body: {
        type: 'object',
        example: {
          message: 'Conversation created successfully.',
        },
      },
    },
  },
  GetConversationResponse: {
    200: {
        body: {
          type: 'object',
          example: {
            conversations: [
                name: 'GroupChat',
                isGroupChat: true,
                createdByKey: 1
            ]
          },
        },
      },
  },
  GetUserMessages: {
    200: {
        body: {
          type: 'object',
          example: {
            message: 
            [
                senderKey: 1,
                message:'hello',
                createAt: '2025-01-19 14:49:21.547212'
            ],
            metaData: {
                totalMessageCount:50,
                messagePerPage:10
            }
          },
        },
      },
  }
};
