const DEFAULT_LENGTH = 10;

const generateRandomDigits = (length = DEFAULT_LENGTH) => {
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10).toString();
  }

  if (result[0] === '0') {
    result = `1${result.slice(1)}`;
  }

  return result;
};

const generateUniqueAccountNumber = async (
  findAccountByAccountNumber,
  length = DEFAULT_LENGTH,
  maxAttempts = 20
) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const accountNumber = generateRandomDigits(length);
    // eslint-disable-next-line no-await-in-loop
    const existingAccount = await findAccountByAccountNumber(accountNumber);

    if (!existingAccount) {
      return accountNumber;
    }
  }

  throw new Error('Failed to generate unique account number');
};

module.exports = {
  generateRandomDigits,
  generateUniqueAccountNumber,
};