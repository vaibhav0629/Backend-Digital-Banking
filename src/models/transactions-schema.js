module.exports = (db) =>
  db.model(
    'Transactions',
    db.Schema(
      {
        fromAccount: {
          type: String,
        },
        toAccount: {
          type: String,
        },
        type: {
          type: String,
          enum: ['deposit', 'transfer', 'withdraw'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['success', 'failed', 'pending'],
          default: 'success',
        },
      },
      { timestamps: true }
    )
  );
