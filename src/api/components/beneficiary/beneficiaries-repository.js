const { Beneficiaries } = require('../../../models');

async function getByOwnerAccountId(accountId) {
  return Beneficiaries.find({ ownerAccountId: accountId });
}

async function create(data) {
  return Beneficiaries.create(data);
}

module.exports = {
  getByOwnerAccountId,
  create,
};