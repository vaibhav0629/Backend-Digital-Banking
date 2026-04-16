const express = require('express');
const transactionsController = require('./transactions-controller');
const authMiddleware = require('../../middlewares/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/transactions', route);

  route.post('/transfer', authMiddleware, transactionsController.transferBank);
  route.get(
    '/history',
    authMiddleware,
    transactionsController.getTransactionHistory
  );
};
