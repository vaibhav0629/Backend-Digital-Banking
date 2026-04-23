const beneficiariesService = require('./beneficiaries-service');
const accountsService = require('../accounts/accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getBeneficiaries(req, res, next) {
  try {
    // eslint-disable-next-line no-underscore-dangle
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

    // eslint-disable-next-line no-underscore-dangle
    const data = await beneficiariesService.getBeneficiaries(account._id);

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
    // eslint-disable-next-line no-underscore-dangle
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

    const accountResult = await accountsService.getAccountByUserId(
      userId,
      accountType
    );

    const account = accountResult?.data || accountResult[0] || accountResult;

    // eslint-disable-next-line no-underscore-dangle
    if (!account || !account._id) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Account not found'
      );
    }

    const newBeneficiary = await beneficiariesService.createBeneficiary({
      // eslint-disable-next-line no-underscore-dangle
      ownerAccountId: account._id,
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
