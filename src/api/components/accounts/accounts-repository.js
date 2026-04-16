const { Accounts } = require('../../../models');

async function getAccounts() {
  return Accounts.find({});
}

async function getAccount(id) {
  return Accounts.findById(id);
}

async function getAccountByUserId(userId, accountType) {
  return Accounts.findOne({ userId }, { accountType });
}

async function getAccountId(id) {
  const account = await Accounts.findById(id);
  // eslint-disable-next-line no-underscore-dangle
  return account._id;
}

async function getBalance(id) {
  const account = await Accounts.findById(id);
  return account.balance;
}

async function setBalance(id, balance) {
  const account = await Accounts.findById(id);
  account.balance = balance;
  return account;
}

module.exports = {
  getAccounts,
  getAccount,
  getAccountByUserId,
  getBalance,
  setBalance,
  getAccountId,
};
