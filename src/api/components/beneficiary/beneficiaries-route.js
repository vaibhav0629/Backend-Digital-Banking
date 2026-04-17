const express = require('express');
const controller = require('./beneficiaries-controller');
const authMiddle = require('../../middleware/auth-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/beneficiaries', route);

  route.get('/', authMiddle.UserAuth, controller.getBeneficiaries);
};
