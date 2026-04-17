const { Accounts, Transactions } = require('../../../models');

async function getAccountByUserId(userId) {
  return Accounts.findOne({ userId });
}

async function getAccountByAccountNumber(accountNumber) {
  return Accounts.findOne({ accountNumber });
}

async function updateBalance(accountId, balance) {
  return Accounts.updateOne({ _id: accountId }, { $set: { balance } });
}

async function createTransaction(data) {
  return Transactions.create(data);
}

async function getTransactionByAccount(accountNumber) {
  return Transactions.find({
    $or: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
  }).sort({ createdAt: -1 });
}

async function updateTransactionStatus(id, status) {
  return Transactions.updateOne({ _id: id }, { $set: { status } });
}

module.exports = {
  getAccountByUserId,
  getAccountByAccountNumber,
  updateBalance,
  createTransaction,
  getTransactionByAccount,
  updateTransactionStatus,
};
