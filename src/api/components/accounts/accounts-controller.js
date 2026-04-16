const accountsService = require('./accounts-service');

async function getAccounts(req, res, next) {
  try {
    const accounts = await accountsService.getAccounts();

    return res.status(200).json({
      status: 'success',
      message: 'Accounts retrieved successfully',
      data: accounts,
    });
  } catch (error) {
    return next(error);
  }
}

async function createAccount(req, res, next) {
  try {
    const account = await accountsService.createAccount(req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAccount(req, res, next) {
  try {
    const { id } = req.params;
    const account = await accountsService.getAccount(id);

    if (!account) {
      return res.status(404).json({
        status: 'fail',
        message: 'Account not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Account retrieved successfully',
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAccountByUserId(req, res, next) {
  try {
    const { userId } = req.params;
    const accounts = await accountsService.getAccountByUserId(userId);

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Account not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Accounts retrieved successfully',
      data: accounts,
    });
  } catch (error) {
    return next(error);
  }
}

async function getBalance(req, res, next) {
  try {
    const { id } = req.params;
    const balance = await accountsService.getBalance(id);

    return res.status(200).json({
      status: 'success',
      message: 'Balance retrieved successfully',
      data: {
        balance,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function setBalance(req, res, next) {
  try {
    const { id } = req.params;
    const { balance } = req.body;

    const account = await accountsService.setBalance(id, balance);

    return res.status(200).json({
      status: 'success',
      message: 'Balance updated successfully',
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

async function setPin(req, res, next) {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    const account = await accountsService.setPin(id, pin);

    return res.status(200).json({
      status: 'success',
      message: 'PIN updated successfully',
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

async function updatePin(req, res, next) {
  try {
    const { id } = req.params;
    const { oldPin, newPin, confirmNewPin } = req.body;

    const account = await accountsService.updatePin(
      id,
      oldPin,
      newPin,
      confirmNewPin
    );

    return res.status(200).json({
      status: 'success',
      message: 'PIN updated successfully',
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAccounts,
  createAccount,
  getAccount,
  getAccountByUserId,
  getBalance,
  setBalance,
  setPin,
  updatePin,
};
