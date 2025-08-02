const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  location: String
});

const UrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortcode: { type: String, unique: true },
  createdAt: Date,
  expiry: Date,
  clicks: [ClickSchema]
});

module.exports = mongoose.model("Url", UrlSchema);
