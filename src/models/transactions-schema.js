module.exports = (db) =>
  db.model(
    'Transactions',
    db.Schema(
      {
        fromAccount: {
          type: String,
          default: null,
        },
        toAccount: {
          type: String,
          default: null,
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
          enum: ['pending', 'success', 'failed'],
          default: 'pending',
        },
        processedAt: {
          type: Date,
          default: null,
        },
      },
      { timestamps: true }
    )
  );
