const express = require('express');
const transactionsController = require('./transactions-controller');
const authMiddleware = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/transactions', route);

  route.post(
    '/transfer',
    authMiddleware.TransactAuth,
    transactionsController.transferBank
  );
  route.get(
    '/history',
    authMiddleware.UserAuth,
    transactionsController.getTransactionHistory
  );
};
