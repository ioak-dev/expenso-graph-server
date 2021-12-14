var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expenseSchema = new Schema(
  {
    description: { type: String },
    category: { type: String },
    billDate: { type: String },
    amount: { type: String },
  },
  { timestamps: true }
);

const expenseCollection = "expense";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { expenseSchema, expenseCollection };
