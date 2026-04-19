const beneficiariesRepository = require('./beneficiaries-repository');

async function getBeneficiaries(accountId) {
  return beneficiariesRepository.getByOwnerAccountId(accountId);
}

async function createBeneficiary(data) {
  return beneficiariesRepository.create(data);
}

module.exports = {
  getBeneficiaries,
  createBeneficiary,
};