const accountsService = require('../accounts/accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const transactionsRepository = require('../transaction/transaction-repository');

async function deposit(req, res, next) {
  try {
    const { ammount } = req.body;
    const account = req.user;
    if (!account) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Account not found'
      );
    }
    // eslint-disable-next-line no-underscore-dangle
    const accountId = account._id;
    if (!ammount || ammount < 0) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Invalid amount value'
      );
    }
    const success = await accountsService.setBalance(
      accountId,
      account.balance + ammount
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Deposit'
      );
    }
    const transaction = await transactionsRepository.createTransaction({
      fromAccount: accountId,
      toAccount: 'none',
      type: 'deposit',
      amount: ammount,
      description: 'Storing money',
      status: 'success',
    });
    if (!transaction) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to save deposit history'
      );
    }
    return res.status(200).json({ message: 'Successful deposit!' });
  } catch (error) {
    return next(error);
  }
}

async function withdraw(req, res, next) {
  try {
    const { ammount } = req.body;
    const account = req.user;

    if (!account) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Account not found'
      );
    }
    // eslint-disable-next-line no-underscore-dangle
    const accountId = account._id;
    if (!ammount || ammount < 0) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Invalid amount value'
      );
    }
    const totalRemaining = account.balance - ammount;
    if (totalRemaining < 0) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Withdrawal amount exceeds balance'
      );
    }
    const success = await accountsService.setBalance(accountId, totalRemaining);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to withdraw'
      );
    }
    const transaction = await transactionsRepository.createTransaction({
      fromAccount: accountId,
      toAccount: 'none',
      type: 'withdraw',
      amount: ammount,
      description: 'Taking money',
      status: 'success',
    });
    if (!transaction) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to save withdraw history'
      );
    }
    return res.status(200).json({ message: 'Successful withdrawal!' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  deposit,
  withdraw,
};
