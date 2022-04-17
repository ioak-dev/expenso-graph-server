var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const importLogSchema = new Schema(
  {
    transactionId: { type: String },
    transactionDate: { type: Date },
    lineItems: { type: Number },
    receipts: { type: Number },
    total: { type: Number },
    categoryCount: { type: Number },
    tagCount: { type: Number },
  },
  { timestamps: true }
);

const importLogCollection = "import.log";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { importLogSchema, importLogCollection };
