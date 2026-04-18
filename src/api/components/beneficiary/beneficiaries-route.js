const express = require('express');
const controller = require('./beneficiaries-controller');
const { UserAuth } = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/beneficiaries', route);

  route.get('/', UserAuth, controller.getBeneficiaries);
};
