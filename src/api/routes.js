const express = require('express');

const users = require('./components/users/users-route');
const accounts = require('./components/accounts/accounts-route');
const transaction = require('./components/transaction/transaction-route');
const auth = require('./components/auth/auth-route');
const admin = require('./components/admin/admin-route');
const beneficiaries = require('./components/beneficiary/beneficiaries-route');

module.exports = () => {
  const app = express.Router();

  auth(app);
  users(app);
  admin(app);
  accounts(app);
  beneficiaries(app);
  transaction(app);

  return app;
};
