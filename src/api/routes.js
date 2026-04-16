const express = require('express');

const users = require('./components/users/users-route');
const accounts = require('./components/accounts/accounts-route');

module.exports = () => {
  const app = express.Router();

  users(app);
  accounts(app);

  return app;
};
