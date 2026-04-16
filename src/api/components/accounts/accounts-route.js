const express = require('express');

const accountsController = require('./accounts-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/accounts', route);

  // Get list of accounts
  route.get('/', accountsController.getAccounts);

  // Get account by user id
  route.get('/user/:userId', accountsController.getAccountByUserId);

  // Get account balance
  route.get('/:id/balance', accountsController.getBalance);

  // Update account balance
  route.patch('/:id/balance', accountsController.setBalance);

  // Set account transaction PIN
  route.patch('/:id/pin', accountsController.setPin);

  // Get account detail
  route.get('/:id', accountsController.getAccount);
};