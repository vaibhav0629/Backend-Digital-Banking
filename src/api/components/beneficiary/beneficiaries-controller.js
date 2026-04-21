const beneficiariesService = require('./beneficiaries-service');
const accountsService = require('../accounts/accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getBeneficiaries(req, res, next) {
  try {
    const userId = req.user._id;
    const { accountType } = req.body;

    const account = await accountsService.getAccountByUserId(
      userId,
      accountType
    );
    if (!account) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Account not found'
      );
    }

    const accountId = await accountsService.getAccountId(account);

    const data = await beneficiariesService.getBeneficiaries(accountId);

    return res.status(200).json({
      message: 'List of Beneficiary',
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function createBeneficiaries(req, res, next) {
  try {
    const userId = req.user._id;

    const {
      recipientAccountNumber,
      recipientName,
      bankName,
      alias,
      accountType = 'savings',
    } = req.body;

    if (!recipientAccountNumber || !recipientName || !bankName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Missing required fields'
      );
    }

    const account = await accountsService.getAccountByUserId(
      userId,
      accountType
    );

    if (!account) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Account not found'
      );
    }

    const accountId = await accountsService.getAccountId(account);

    const newBeneficiary = await beneficiariesService.createBeneficiary({
      ownerAccountId: accountId,
      recipientAccountNumber,
      recipientName,
      bankName,
      alias,
    });

    return res.status(201).json({
      message: 'Beneficiary added successfully',
      data: newBeneficiary,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBeneficiaries,
  createBeneficiaries,
};
