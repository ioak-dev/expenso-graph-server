var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const portalaccessSchema = new Schema(
  {
    name: { type: String },
    apiKey: { type: String },
    claims: { type: Object },
  },
  { timestamps: true }
);

const portalaccessCollection = "portalaccess";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { portalaccessSchema, portalaccessCollection };
