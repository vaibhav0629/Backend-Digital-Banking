const express = require('express');

const users = require('./components/users/users-route');
const accounts = require('./components/accounts/accounts-route');
const auth = require('./components/auth/auth-route');

module.exports = () => {
  const app = express.Router();

  auth(app);
  users(app);
  accounts(app);

  return app;
};
