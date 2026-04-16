const { accountsRepository } = require('./accounts-repository');

async function getAccounts() {
  return accountsRepository.getAccounts();
}

async function getAccount(id) {
  return accountsRepository.getAccount(id);
}

async function getAccountByUserId(userId, accountType) {
  return accountsRepository.getAccountByUserId(userId, accountType);
}

async function getAccountId(id) {
  return accountsRepository.getAccountId(id);
}

async function getBalance(id) {
  return accountsRepository.getBalance(id);
}

async function setBalance(id, balance) {
  return accountsRepository.setBalance(id, balance);
}

module.exports = {
  getAccounts,
  getAccount,
  getAccountByUserId,
  getBalance,
  setBalance,
  getAccountId,
};
