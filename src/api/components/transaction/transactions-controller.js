const transactionsService = require('./transactions-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transferBank(req, res, next) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const userId = req.account._id;

    const {
      toAccountNumber,
      amount,
      description,
      idempotencyKey, // ✅ NEW
    } = req.body;

    if (!toAccountNumber) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Receiver account number is required'
      );
    }

    if (!amount || amount <= 0) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Amount must be greater than 0'
      );
    }

    await transactionsService.transferBank(
      userId,
      toAccountNumber,
      amount,
      description,
      idempotencyKey // ✅ pass it
    );

    return res.status(200).json({
      success: true,
      message: 'Transfer successful',
    });
  } catch (error) {
    return next(error);
  }
}

async function getTransactionHistory(userId) {
  const account = await transactionsRepository.getAccountByUserId(userId);

  if (!account) throw new Error('Account not found');

  return transactionsRepository.getTransactionsByAccount(account.accountNumber);
}

module.exports = {
  transferBank,
  getTransactionHistory,
};
