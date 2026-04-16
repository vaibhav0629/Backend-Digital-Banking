const { Router } = require('express');

const authController = require('./auth-controllers');

const route = Router();

module.exports = (app) => {
  app.use('/auth/', route);

  route.post('/login', authController.login);
  route.post('/register', authController.register);
};
