const { Users, Transactions } = require('../../../models');

async function getAllUsers() {
  return Users.find({}, { password: 0 });
}

async function getAllTransactions() {
  return Transactions.find().sort({ createdAt: -1 });
}

module.exports = {
  getAllUsers,
  getAllTransactions,
};
