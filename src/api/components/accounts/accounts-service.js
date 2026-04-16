const accountsRepository = require('./accounts-repository');
const { hashPassword, comparePassword } = require('../../../utils/password');

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
    existingAccount = await accountsRepository.getAccountByAccountNumber(
      accountNumber
    );
  } while (existingAccount);

  return accountNumber;
}

async function getAccounts() {
  return accountsRepository.getAccounts();
}

async function getAccount(id) {
  return accountsRepository.getAccount(id);
}

async function getAccountByUserId(userId, accountType) {
  return accountsRepository.getAccountByUserId(userId, accountType);
}

async function getAccountId(id) {
  return accountsRepository.getAccountId(id);
}

async function getBalance(id) {
  return accountsRepository.getBalance(id);
}

async function setBalance(id, balance) {
  if (balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  return accountsRepository.setBalance(id, balance);
}

async function setPin(id, pin) {
  if (!pin) {
    throw new Error('PIN is required');
  }

  if (!/^\d{6}$/.test(pin)) {
    throw new Error('PIN must be exactly 6 digits');
  }

  const hashedPin = await hashPassword(pin);
  return accountsRepository.setPin(id, hashedPin);
}

async function verifyPin(id, pin) {
  if (!pin) {
    throw new Error('PIN is required');
  }

  const hashedPin = await accountsRepository.getPin(id);

  if (!hashedPin) {
    throw new Error('PIN has not been set for this account');
  }

  return comparePassword(pin, hashedPin);
}

async function authorizeTransaction(id, pin) {
  const isValidPin = await verifyPin(id, pin);

  if (!isValidPin) {
    throw new Error('Invalid transaction PIN');
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
    throw new Error('userId is required');
  }

  if (!pin) {
    throw new Error('PIN is required');
  }

  if (!confirmPin) {
    throw new Error('confirmPin is required');
  }

  if (!/^\d{6}$/.test(pin)) {
    throw new Error('PIN must be exactly 6 digits');
  }

  if (pin !== confirmPin) {
    throw new Error('PIN confirmation does not match');
  }

  let finalAccountNumber = accountNumber;

  if (!finalAccountNumber) {
    finalAccountNumber = await generateUniqueAccountNumber();
  } else {
    const existingNumberAccount =
      await accountsRepository.getAccountByAccountNumber(finalAccountNumber);

    if (existingNumberAccount) {
      throw new Error('Account number already exists');
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
  if (!oldPin) {
    throw new Error('oldPin is required');
  }

  if (!newPin) {
    throw new Error('newPin is required');
  }

  if (!confirmNewPin) {
    throw new Error('confirmNewPin is required');
  }

  if (!/^\d{6}$/.test(newPin)) {
    throw new Error('New PIN must be exactly 6 digits');
  }

  if (newPin !== confirmNewPin) {
    throw new Error('New PIN confirmation does not match');
  }

  const isOldPinValid = await verifyPin(id, oldPin);

  if (!isOldPinValid) {
    throw new Error('Old PIN is incorrect');
  }

  if (oldPin === newPin) {
    throw new Error('New PIN must be different from old PIN');
  }

  const hashedNewPin = await hashPassword(newPin);
  return accountsRepository.setPin(id, hashedNewPin);
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
  getAccountId,
};
