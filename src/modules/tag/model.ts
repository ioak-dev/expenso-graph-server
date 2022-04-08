var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const tagSchema = new Schema(
  {
    name: { type: String },
  },
  { timestamps: true }
);

const tagCollection = "tag";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { tagSchema, tagCollection };
