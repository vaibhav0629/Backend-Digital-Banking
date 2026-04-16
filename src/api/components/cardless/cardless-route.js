const express = require('express');

const cardlessController = require('./cardless-controller');

const authMiddleware = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/cardless', route);

  route.post('/deposit/', authMiddleware.UserAuth, cardlessController.deposit);
  route.post(
    '/withdraw/',
    authMiddleware.UserAuth,
    cardlessController.withdraw
  );
};
