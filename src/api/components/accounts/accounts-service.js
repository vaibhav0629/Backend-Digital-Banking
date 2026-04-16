const accountsRepository = require('./accounts-repository');
const { hashPassword, comparePassword } = require('../../../utils/password');

async function getAccounts() {
  return accountsRepository.getAccounts();
}

async function getAccount(id) {
  return accountsRepository.getAccount(id);
}

async function getAccountByUserId(userId) {
  return accountsRepository.getAccountByUserId(userId);
}

async function getBalance(id) {
  return accountsRepository.getBalance(id);
}

async function setBalance(id, balance) {
  if (balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  return accountsRepository.setBalance(id, balance);
}

async function setPin(id, pin) {
  if (!pin) {
    throw new Error('PIN is required');
  }

  if (!/^\d{6}$/.test(pin)) {
    throw new Error('PIN must be exactly 6 digits');
  }

  const hashedPin = await hashPassword(pin);
  return accountsRepository.setPin(id, hashedPin);
}

async function verifyPin(id, pin) {
  if (!pin) {
    throw new Error('PIN is required');
  }

  const hashedPin = await accountsRepository.getPin(id);

  if (!hashedPin) {
    throw new Error('PIN has not been set for this account');
  }

  return comparePassword(pin, hashedPin);
}

async function authorizeTransaction(id, pin) {
  const isValidPin = await verifyPin(id, pin);

  if (!isValidPin) {
    throw new Error('Invalid transaction PIN');
  }

  return true;
}

module.exports = {
  getAccounts,
  getAccount,
  getAccountByUserId,
  getBalance,
  setBalance,
  setPin,
  verifyPin,
  authorizeTransaction,
};