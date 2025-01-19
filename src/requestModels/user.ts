import Joi from 'joi';

export = {
  0: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required().trim(),
    },
    model: 'UpdateUserRequest',
    group: 'User',
    description: 'Update user details',
  },
};
