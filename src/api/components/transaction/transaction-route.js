const express = require('express');
const transactionsController = require('./transaction-controller');
const authMiddleware = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/transactions', route);

  route.post(
    '/transfer',
    authMiddleware.TransactAuth,
    transactionsController.transfer
  );
  route.get(
    '/history',
    authMiddleware.UserAuth,
    transactionsController.getTransactionHistory
  );
};
