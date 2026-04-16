const { Accounts } = require('../../../models');

async function getAccounts() {
  return Accounts.find({});
}

async function getAccount(id) {
  return Accounts.findById(id);
}

async function getAccountByUserId(userId) {
  return Accounts.findOne({ userId });
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
};
