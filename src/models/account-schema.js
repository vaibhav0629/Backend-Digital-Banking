module.exports = (db) =>
  db.model(
    'Account',
    db.Schema({
      userId: {
        type: db.Schema.Types.ObjectId,
        ref: 'User',
      },
      balance: Number,
      isActive: Boolean,
    })
  );
