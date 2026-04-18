const AdminRepository = require('./admin-repository');

async function getUsers() {
  return AdminRepository.getAllUsers();
}

async function getTransactions() {
  return AdminRepository.getAllTransactions();
}

module.exports = {
  getUsers,
  getTransactions,
};
