const express = require('express');

const users = require('./components/users/users-route');
const accounts = require('./components/accounts/accounts-route');
const auth = require('./components/auth/auth-route');
const cardless = require('./components/cardless/cardless-route');

module.exports = () => {
  const app = express.Router();

  auth(app);
  users(app);
  accounts(app);
  cardless(app);

  return app;
};
