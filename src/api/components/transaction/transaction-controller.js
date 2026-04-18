const transactionsService = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transfer(request, response, next) {
  try {
    const senderAccount = request.user;

    const { recipientAccountNumber, amount, description } = request.body;

    if (!recipientAccountNumber) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'The recipient cannot be empty!'
      );
    }

    if (!amount || amount <= 0) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'The amount must be greater than zero!'
      );
    }

    await transactionsService.transfer(
      senderAccount,
      recipientAccountNumber,
      amount,
      description
    );

    return response.status(200).json({
      status: 'success',
      message: 'Transfer successful',
    });
  } catch (error) {
    return next(error);
  }
}

async function getTransactionHistory(request, response, next) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const account = request.user;

    const transactions =
      await transactionsService.getTransactionHistory(account);

    return response.status(200).json({
      status: 'success',
      message: 'Transaction history retrieved',
      data: transactions,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  transfer,
  getTransactionHistory,
};
