const authService = require('./auth-service');
const userController = require('../users/users-controller');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { getAccountByUserId } = require('../accounts/accounts-service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Email or Password is required'
      );
    }
    const token = await authService.checkLogin(email, password);
    if (!token) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong password or email'
      );
    }
    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
}

async function transaction(req, res, next) {
  try {
    const { pin, accountType } = req.body;

    // eslint-disable-next-line no-underscore-dangle
    const accounts = await getAccountByUserId(req.user._id, accountType);
    if (!accounts) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'No account of that type'
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    const token = await authService.doTransaction(accounts._id, pin);
    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register: userController.createUser,
  transaction,
};
