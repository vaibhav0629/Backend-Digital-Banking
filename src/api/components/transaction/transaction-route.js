const express = require('express');
const transactionsController = require('./transactions-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/transactions', route);

  route.post('/transfer', transactionsController.transferBank);

  route.get('/history', transactionsController.getTransactionHistory);
};
