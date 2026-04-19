const express = require('express');
const controller = require('./admin-controller');
const { AdminAuth } = require('../../middlewares/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('./admin', route);

  route.get('/users', AdminAuth, controller.getUsers);
  route.get('/transactions', AdminAuth, controller.getTransactions);
};
