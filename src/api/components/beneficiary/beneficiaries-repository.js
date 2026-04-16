const { Beneficiaries } = require('../../../models');

async function getByOwnerAccountId(accountId) {
  return Beneficiaries.find({ ownerAccountId: accountId });
}

module.exports = {
  getByOwnerAccountId,
};