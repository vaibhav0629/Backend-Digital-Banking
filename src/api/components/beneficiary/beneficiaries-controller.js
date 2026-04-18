const beneficiariesService = require('./beneficiaries-service');
const accountsService = require('../accounts/accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getBeneficiaries(req, res, next) {
  try {
    const userId = req.user._id;

    const account = await accountsService.getAccountByUserId(userId, 'savings');
    if (!account) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Account not found'
      );
    }

    const accountId = await accountsService.getAccountId(account);

    const data = await beneficiariesService.getBeneficiaries(accountId);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBeneficiaries,
};
