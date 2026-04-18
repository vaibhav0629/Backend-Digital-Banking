const adminService = require('./admin-service');

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getUsers();
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getTransactions(req, res, next) {
  try {
    const transactions = await adminService.getTransactions();
    return res.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getTransactions,
};
