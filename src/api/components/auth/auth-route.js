const { Router } = require('express');

const authController = require('./auth-controllers');
const authMiddleware = require('../../middleware/auth-middleware');

const route = Router();

module.exports = (app) => {
  app.use('/auth/', route);

  route.post('/login', authController.login);
  route.post('/register', authController.register);
  route.post(
    '/transaction',
    authMiddleware.UserAuth,
    authController.transaction
  );
};
