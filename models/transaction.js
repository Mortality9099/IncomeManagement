const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expenditure'], required: true },
    date: { type: Date, default: Date.now },
    amount: {
        type: Number,
        required: true,
      },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {type: String}
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;