module.exports = (mongoose) =>
  mongoose.model(
    'Accounts',
    new mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
      balance: {
        type: Number,
        default: 0,
      },
      accountNumber: {
        type: String,
        required: true,
        unique: true,
      },
    })
  );