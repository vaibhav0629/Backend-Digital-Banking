const { Accounts, Transactions } = require('../../../models');

// Get sender account
async function getAccountByUserId(userId) {
  return Accounts.findOne({ userId });
}

// Get receiver account
async function getAccountByAccountNumber(accountNumber) {
  return Accounts.findOne({ accountNumber });
}

// Update balance
async function updateBalance(accountId, balance) {
  return Accounts.updateOne({ _id: accountId }, { $set: { balance } });
}

// Create transaction
async function createTransaction(data) {
  return Transactions.create(data);
}

// Get transaction history
async function getTransactionsByAccount(accountNumber) {
  return Transactions.find({
    $or: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
  }).sort({ createdAt: -1 });
}

module.exports = {
  getAccountByUserId,
  getAccountByAccountNumber,
  updateBalance,
  createTransaction,
  getTransactionsByAccount,
};
