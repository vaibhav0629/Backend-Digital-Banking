const accountsRepository = require('./accounts-repository');
const { hashPassword, comparePassword } = require('../../utils/password');
const { errorResponder, errorTypes } = require('../../core/error');

function generateRandomAccountNumber(length = 10) {
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10).toString();
  }

  if (result[0] === '0') {
    result = `1${result.slice(1)}`;
  }

  return result;
}

async function generateUniqueAccountNumber() {
  let accountNumber;
  let existingAccount;

  do {
    accountNumber = generateRandomAccountNumber();
    // eslint-disable-next-line no-await-in-loop
    existingAccount =
      // eslint-disable-next-line no-await-in-loop
      await accountsRepository.getAccountByAccountNumber(accountNumber);
  } while (existingAccount);

  return accountNumber;
}

async function getAccounts() {
  return accountsRepository.getAccounts();
}

async function getAccount(id) {
  const account = await accountsRepository.getAccount(id);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  return account;
}

async function getAccountByUserId(userId) {
  if (!userId) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'userId is required');
  }

  const accounts = await accountsRepository.getAccountByUserId(userId);

  if (!accounts || accounts.length === 0) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  return accounts;
}

async function getBalance(id) {
  if (!id) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Account id is required');
  }

  const account = await accountsRepository.getAccount(id);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  return account.balance;
}

async function setBalance(id, balance) {
  if (!id) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Account id is required');
  }

  if (balance === undefined || balance === null) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Balance is required');
  }

  if (typeof balance !== 'number') {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Balance must be a number');
  }

  if (balance < 0) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'Balance cannot be negative'
    );
  }

  const account = await accountsRepository.getAccount(id);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  return accountsRepository.setBalance(id, balance);
}

async function setPin(id, pin) {
  if (!id) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Account id is required');
  }

  if (!pin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'PIN is required');
  }

  if (!/^\d{6}$/.test(pin)) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'PIN must be exactly 6 digits'
    );
  }

  const account = await accountsRepository.getAccount(id);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  const hashedPin = await hashPassword(pin);
  return accountsRepository.setPin(id, hashedPin);
}

async function verifyPin(id, pin) {
  if (!id) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Account id is required');
  }

  if (!pin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'PIN is required');
  }

  const account = await accountsRepository.getAccount(id);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  const hashedPin = await accountsRepository.getPin(id);

  if (!hashedPin) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'PIN has not been set for this account'
    );
  }

  return comparePassword(pin, hashedPin);
}

async function authorizeTransaction(id, pin) {
  const isValidPin = await verifyPin(id, pin);

  if (!isValidPin) {
    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Invalid transaction PIN'
    );
  }

  return true;
}

async function createAccount(payload) {
  const {
    userId,
    accountNumber,
    balance = 0,
    accountType = 'savings',
    status = 'active',
    pin,
    confirmPin,
  } = payload;

  if (!userId) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'userId is required');
  }

  if (!pin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'PIN is required');
  }

  if (!confirmPin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'confirmPin is required');
  }

  if (!/^\d{6}$/.test(pin)) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'PIN must be exactly 6 digits'
    );
  }

  if (pin !== confirmPin) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'PIN confirmation does not match'
    );
  }

  if (typeof balance !== 'number') {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Balance must be a number');
  }

  if (balance < 0) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'Balance cannot be negative'
    );
  }

  let finalAccountNumber = accountNumber;

  if (!finalAccountNumber) {
    finalAccountNumber = await generateUniqueAccountNumber();
  } else {
    const existingNumberAccount =
      await accountsRepository.getAccountByAccountNumber(finalAccountNumber);

    if (existingNumberAccount) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'Account number already exists'
      );
    }
  }

  const hashedPin = await hashPassword(pin);

  return accountsRepository.createAccount({
    userId,
    accountNumber: finalAccountNumber,
    balance,
    accountType,
    status,
    pin: hashedPin,
  });
}

async function updatePin(id, oldPin, newPin, confirmNewPin) {
  if (!id) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Account id is required');
  }

  if (!oldPin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'oldPin is required');
  }

  if (!newPin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'newPin is required');
  }

  if (!confirmNewPin) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'confirmNewPin is required');
  }

  if (!/^\d{6}$/.test(newPin)) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'New PIN must be exactly 6 digits'
    );
  }

  if (newPin !== confirmNewPin) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'New PIN confirmation does not match'
    );
  }

  const account = await accountsRepository.getAccount(id);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  const isOldPinValid = await verifyPin(id, oldPin);

  if (!isOldPinValid) {
    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Old PIN is incorrect'
    );
  }

  if (oldPin === newPin) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'New PIN must be different from old PIN'
    );
  }

  const hashedNewPin = await hashPassword(newPin);
  return accountsRepository.setPin(id, hashedNewPin);
}

async function deleteAccountsByUserId(userId) {
  if (!userId) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'userId is required');
  }

  return accountsRepository.deleteAccountsByUserId(userId);
}

module.exports = {
  getAccounts,
  getAccount,
  getAccountByUserId,
  getBalance,
  setBalance,
  setPin,
  verifyPin,
  authorizeTransaction,
  createAccount,
  updatePin,
  deleteAccountsByUserId,
};