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

  if (!account) {
    throw new Error('Account not found');
  }

  return account.balance;
}

async function setBalance(id, balance) {
  const account = await Accounts.findById(id);

  if (!account) {
    throw new Error('Account not found');
  }

  account.balance = balance;
  await account.save();

  return account;
}

async function setPin(id, hashedPin) {
  const account = await Accounts.findById(id);

  if (!account) {
    throw new Error('Account not found');
  }

  account.pin = hashedPin;
  await account.save();

  return account;
}

async function getPin(id) {
  const account = await Accounts.findById(id);

  if (!account) {
    throw new Error('Account not found');
  }

  return account.pin;
}

async function getAccountByAccountNumber(accountNumber) {
  return Accounts.findOne({ accountNumber });
}

module.exports = {
  getAccounts,
  getAccount,
  getAccountByUserId,
  getBalance,
  setBalance,
  setPin,
  getPin,
  getAccountByAccountNumber,
};