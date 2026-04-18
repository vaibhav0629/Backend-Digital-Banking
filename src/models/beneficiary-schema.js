module.exports = (db) =>
  db.model(
    'Beneficiaries',
    db.Schema(
      {
        ownerAccountId: {
          type: db.Schema.Types.ObjectId,
          ref: 'Accounts',
          required: true,
        },
        recipientAccountNumver: {
          type: String,
          required: true,
        },
        recipientName: {
          type: String,
          require: true,
        },
        bankName: {
          type: String,
          required: true,
        },
        alias: {
          type: String,
          default: '',
        },
      },
      { timestamps: true }
    )
  );
