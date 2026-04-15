const transactionsRepository = require('./transactions-repository');

async function transferBank(
  userId,
  toAccountNumber,
  amount,
  description,
  idempotencyKey
) {
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // ✅ Prevent duplicate transactions
  if (idempotencyKey) {
    const existing =
      await transactionsRepository.getTransactionByIdempotencyKey(
        idempotencyKey
      );
    if (existing) {
      throw new Error('Duplicate transaction detected');
    }
  }

  const sender = await transactionsRepository.getAccountByUserId(userId);
  if (!sender) throw new Error('Sender account not found');

  const receiver =
    await transactionsRepository.getAccountByAccountNumber(toAccountNumber);
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

  // Save transaction (ONE record - enough for your assignment)
  await transactionsRepository.createTransaction({
    fromAccount: sender.accountNumber,
    toAccount: receiver.accountNumber,
    type: 'transfer',
    amount,
    description,
    status: 'success',
    idempotencyKey,
  });

  return true;
}
