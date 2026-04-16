const express = require('express');

const usersController = require('./users-controller');
const authMiddleware = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get user detail
  route.get('/', authMiddleware.UserAuth, usersController.getUser);

  // Update user
  route.put('/', authMiddleware.UserAuth, usersController.updateUser);

  // Change password
  route.put(
    '/change-password',
    authMiddleware.UserAuth,
    usersController.changePassword
  );

  // Delete user
  route.delete('/', authMiddleware.UserAuth, usersController.deleteUser);
};
