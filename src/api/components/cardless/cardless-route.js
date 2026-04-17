const express = require('express');

const cardlessController = require('./cardless-controller');

const authMiddleware = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/cardless', route);

  route.post(
    '/deposit/',
    authMiddleware.TransactAuth,
    cardlessController.deposit
  );
  route.post(
    '/withdraw/',
    authMiddleware.TransactAuth,
    cardlessController.withdraw
  );
};
