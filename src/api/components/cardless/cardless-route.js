const express = require('express');

const cardlessController = require('./cardless-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/cardless', route);

  route.post('/deposit:id', cardlessController.deposit);
  route.post('/withdraw:id', cardlessController.withdraw);
};
