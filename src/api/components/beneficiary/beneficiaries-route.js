const express = require('express');
const controller = require('./beneficiaries-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/beneficiaries', route);

  route.get('/:id', controller.getBeneficiaries);
};