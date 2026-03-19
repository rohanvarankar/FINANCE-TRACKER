const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    await mongoose.connect(uri); // <-- No more extra options!

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // Re-throw to let the caller handle it (e.g. stop server start)
  }
}

module.exports = connectDB;
