const beneficiariesRepository = require('./beneficiaries-repository');

async function getBeneficiaries(accountId) {
  return beneficiariesRepository.getByOwnerAccountId(accountId);
}

module.exports = {
  getBeneficiaries,
};