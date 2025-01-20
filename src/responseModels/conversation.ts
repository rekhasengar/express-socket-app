module.exports = {
  ConversationCreatedResponse: {
    200: {
      body: {
        type: 'object',
        example: {
          message: 'Conversation created successfully.',
        },
      },
    },
    400: {
      body: {
        type: 'object',
        example: {
          error: 'Bad Request',
          message: 'Missing required fields.',
        },
      },
    },
    500: {
      body: {
        type: 'object',
        example: {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred while creating the conversation.',
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
            {
              name: 'GroupChat',
              isGroupChat: true,
              createdByKey: 1,
            },
          ],
        },
      },
    },
    404: {
      body: {
        type: 'object',
        example: {
          error: 'Not Found',
          message: 'No conversations found for the user.',
        },
      },
    },
    500: {
      body: {
        type: 'object',
        example: {
          error: 'Internal Server Error',
          message: 'Failed to retrieve conversations.',
        },
      },
    },
  },

  GetUserMessages: {
    200: {
      body: {
        type: 'object',
        example: {
          message: [
            {
              senderKey: 1,
              message: 'hello',
              createAt: '2025-01-19 14:49:21.547212',
            },
          ],
          metaData: {
            totalMessageCount: 50,
            messagePerPage: 10,
          },
        },
      },
    },
    400: {
      body: {
        type: 'object',
        example: {
          error: 'Bad Request',
          message: 'Invalid parameters or query.',
        },
      },
    },
    404: {
      body: {
        type: 'object',
        example: {
          error: 'Not Found',
          message: 'Messages not found for the user.',
        },
      },
    },
    500: {
      body: {
        type: 'object',
        example: {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred while fetching messages.',
        },
      },
    },
  },
};
