const transactionsService = require('./transactions-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transferBank(req, res, next) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const userId = req.account._id;

    const { toAccountNumber, amount, description } = req.body;

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
      description
    );

    return res.status(200).json({
      status: 'success',
      message: 'Transfer successful',
    });
  } catch (error) {
    return next(error);
  }
}

async function getTransactionHistory(req, res, next) {
  try {
    const userId = req.user.id;

    const transactions =
      await transactionsService.getTransactionHistory(userId);

    return res.status(200).json({
      status: 'success',
      message: 'Transaction history retrieved',
      data: transactions,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  transferBank,
  getTransactionHistory,
};