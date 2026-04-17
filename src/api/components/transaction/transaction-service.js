const transactionsRepository = require('./transactions-repository');

async function transferBank(userId, toAccountNumber, amount, description) {
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const sender = await transactionsRepository.getAccountByUserId(userId);
  if (!sender) throw new Error('Sender account not found');

  const receiver = await transactionsRepository.getAccountByAccountNumber(toAccountNumber);
  if (!receiver) throw new Error('Receiver account not found');

  if (sender.accountNumber === receiver.accountNumber) {
    throw new Error('Cannot transfer to your own account');
  }

  if (sender.balance < amount) {
    throw new Error('Insufficient balance');
  }

  // Update balances
  await transactionsRepository.updateBalance(
    sender._id,
    sender.balance - amount
  );

  await transactionsRepository.updateBalance(
    receiver._id,
    receiver.balance + amount
  );

  // Save transaction
  await transactionsRepository.createTransaction({
    fromAccount: sender.accountNumber,
    toAccount: receiver.accountNumber,
    type: 'transfer',
    amount,
    description,
    status: 'success',
  });

  return true;
}

<<<<<<< HEAD:src/api/components/transaction/transaction-service.js
async function getTransactionHistory(userId) {
  const account = await transactionsRepository.getAccountByUserId(userId);

  if (!account) throw new Error('Account not found');
  throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Account not found');

  return transactionsRepository.getTransactionsByAccount(
    account.accountNumber
  );
}

module.exports = {
  transferBank,
  getTransactionHistory
};
=======
module.exports = {
  transferBank,
};
>>>>>>> a62ebdcc54ea11e4819a0555b15569b82319cc87:src/api/components/transaction/transactions-service.js
