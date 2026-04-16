const express = require('express');

const accountsController = require('./accounts-controller');
const authMiddle = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/accounts', route);

  // Get list of accounts
  route.get('/', authMiddle.UserAuth, accountsController.getAccounts);

  // Create a new account
  route.post('/', authMiddle.UserAuth, accountsController.createAccount);

  // Get account by user id
  route.get('/user/:userId', accountsController.getAccountByUserId);

  // Get account balance
  route.get('/:id/balance', accountsController.getBalance);

  // Update account balance
  route.patch('/:id/balance', accountsController.setBalance);

  // Initial / direct set account transaction PIN
  route.patch('/:id/pin', accountsController.setPin);

  // Update account transaction PIN using old PIN
  route.patch('/:id/pin/update', accountsController.updatePin);

  // Get account detail
  route.get('/:id', accountsController.getAccount);
};
