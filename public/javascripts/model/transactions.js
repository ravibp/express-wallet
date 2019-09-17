const mongoose = require("mongoose");
let TransactionsSchema = mongoose.Schema({
  username: String,
  amount: Number,
  transactionType: String,
  Date: Date
});
module.exports = mongoose.model("Transactions", TransactionsSchema);
