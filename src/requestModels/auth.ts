import Joi from 'joi';

export = {
  0: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required().trim(),
      password: Joi.string().required(),
    },
    model: 'RegisterRequest',
    group: 'Auth',
    description: 'Create user and save details in database',
  },
  1: {
    body: {
      email: Joi.string().email().required().trim(),
      password: Joi.string().required(),
    },
    model: 'LoginRequest',
    group: 'Auth',
    description: 'Login user',
  },
  2: {
    body: {
      token: Joi.string().required(),
      newPassword: Joi.string().required(),
    },
    model: 'ResetPasswordRequest',
    group: 'Auth',
    description: 'Change user password to a new password',
  },
  3: {
    body: {
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    },
    model: 'ChangePasswordRequest',
    group: 'Auth',
    description: 'Update user password',
  },
};
