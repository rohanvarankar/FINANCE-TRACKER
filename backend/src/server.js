require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Allow frontend to call backend
app.use(
  cors({
    origin: "*", // Change to your frontend URL later for security
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Connect to Database
connectDB(process.env.MONGO_URI);

// Main API routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/profile", profileRoutes);

// Base route (optional)
app.get("/", (req, res) => {
  res.send("Finance Tracker Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cookieParser = require("cookie-parser");
app.use(cookieParser());
