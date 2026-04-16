module.exports = (db) =>
  db.model(
    'Accounts',
    db.Schema(
      {
        userId: {
          type: db.Schema.Types.ObjectId,
          ref: 'Users',
          required: true,
        },
        accountNumber: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },
        balance: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        accountType: {
          type: String,
          required: true,
          default: 'savings',
          enum: ['savings', 'investment'],
        },
        status: {
          type: String,
          required: true,
          default: 'active',
          enum: ['active', 'inactive', 'blocked'],
        },
        pin: {
          type: String,
          required: true,
        },
      },
      { timestamps: true }
    )
  );