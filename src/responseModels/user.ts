export = {
  GetUsersRequest: {
    200: {
      body: {
        type: 'object',
        example: {
          users: [
            {
              id: 1,
              firstName: 'First Name',
              lastName: 'Last Name',
              email: 'someone@example.com',
              createdAt: '2021-10-05T13:50:41.868Z',
              updatedAt: '2021-10-05T13:50:41.868Z',
            },
          ],
          metaData: {
            hasMore: true,
            count: 75,
          },
        },
      },
    },
    404: {
      body: {
        type: 'object',
        example: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      },
    },
  },
  UpdateUserRequest: {
    200: {
      body: {
        type: 'object',
        example: {},
      },
    },
    400: {
      error: 'BadRequest',
      message: 'The request was invalid. Please check your input.',
    },
    404: {
      error: 'NotFound',
      message: 'The user with the provided ID was not found.',
    },
    409: {
      error: 'Conflict',
      message: 'The username or email is already taken.',
    },
  },
  GetUser: {
    200: {
      body: {
        type: 'object',
        example: {
          id: 1,
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'someone@example.com',
          createdAt: '2021-10-05T13:50:41.868Z',
          updatedAt: '2021-10-05T13:50:41.868Z',
        },
      },
    },
    400: {
      error: 'BadRequest',
      message: 'The request is invalid. Please provide a valid user ID.',
    },
    404: {
      error: 'UserNotFound',
      message: 'No user found with the provided ID.',
    },
  },
  DeleteUser: {
    200: {
      body: {
        type: 'object',
        example: {},
      },
    },
    400: {
      error: 'BadRequest',
      message: 'The request is invalid. Please provide a valid user ID.',
    },
    404: {
      error: 'UserNotFound',
      message: 'The user with the provided ID does not exist.',
    },
    500: {
      error: 'InternalServerError',
      message: 'An unexpected error occurred while attempting to delete the user.',
    },
  },
};
