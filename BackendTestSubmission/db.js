const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/urlshortener");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Database connection failed", err);
  }
}
module.exports = connectDB;
