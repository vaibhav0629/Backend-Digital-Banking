const accountsService = require('../accounts/accounts-service');
const usersService = require('../users/users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function deposit(req, res, next) {
  try {
    const userId = req.params.id;
    if (!(await usersService.getUser(userId))) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }
    const { accountType, ammount } = req.body;
    const accountId = await accountsService.getAccountId(
      await accountsService.getAccountByUserId(userId, accountType)
    );
    const success = accountsService.setBalance(
      accountId,
      (await accountsService.getBalance(accountId)) + ammount
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Deposit'
      );
    }
    return res.status(200).json({ message: 'Successful deposit!' });
  } catch (error) {
    return next(error);
  }
}

async function withdraw(req, res, next) {
  try {
    const userId = req.params.id;
    if (!(await usersService.getUser(userId))) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }
    const { accountType, ammount } = req.body;
    const accountId = await accountsService.getAccountId(
      await accountsService.getAccountByUserId(userId, accountType)
    );
    const totalRemaining =
      (await accountsService.getBalance(accountId)) - ammount;
    if (totalRemaining < 0) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Withdrawal ammount exceeds balance'
      );
    }
    const success = accountsService.setBalance(accountId, totalRemaining);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to withdraw'
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
