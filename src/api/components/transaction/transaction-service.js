const transactionsRepository = require('./transaction-repository');
const accountsService = require('../accounts/accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transfer(userId, recipientAccountNumber, amount, description) {
  if (!recipientAccountNumber) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Recipient account number is required'
    );
  }

  if (!amount || amount <= 0) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Amount must be greater than 0'
    );
  }

  const senderAccount = await accountsService.getAccountByUserId(userId);
  if (!senderAccount) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Sender account not found');
  }

  const recipientAccount =
    await transactionsRepository.getAccountByAccountNumber(
      recipientAccountNumber
    );

  if (!recipientAccount) {
    throw errorResponder(
      errorTypes.NOT_FOUND,
      "The recipient account doesn't exist"
    );
  }

  if (senderAccount.accountNumber === recipientAccount.accountNumber) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'You cannot transfer to your own account!'
    );
  }

  const transaction = await transactionsRepository.createTransaction({
    fromAccount: senderAccount.accountNumber,
    toAccount: recipientAccount.accountNumber,
    type: 'transfer',
    amount,
    description,
    status: 'pending',
  });

  try {
    const senderBalance = await accountsService.getBalance(senderAccount.id);

    if (senderBalance < amount) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Insufficient balance'
      );
    }

    await accountsService.setBalance(senderAccount.id, senderBalance - amount);

    const recipientBalance = await accountsService.getBalance(
      recipientAccount.id
    );

    await accountsService.setBalance(
      recipientAccount.id,
      recipientBalance + amount
    );

    await transactionsRepository.updateTransactionStatus(
      transaction.id,
      'success'
    );

    return true;
  } catch (error) {
    try {
      await transactionsRepository.updateTransactionStatus(
        transaction.id,
        'failed'
      );
    } catch (e) {
      console.error('Unable to update transaction status:', {
        transactionId: transaction.id,
        error: e.message,
      });
    }

    throw error;
  }
}

async function getTransactionHistory(userId) {
  const account = await accountsService.getAccountByUserId(userId);

  if (!account) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
  }

  return transactionsRepository.getTransactionByAccount(account.accountNumber);
}

module.exports = {
  transfer,
  getTransactionHistory,
};
