const transactionsService = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transfer(request, response, next) {
  try {
    const sender = request.user.id;

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
      sender,
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
    const userId = request.user.id;

    const transactions =
      await transactionsService.getTransactionHistory(userId);

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
