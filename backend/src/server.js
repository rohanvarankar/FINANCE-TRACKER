require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const aiRoutes = require("./routes/aiRoutes");
const householdRoutes = require("./routes/householdRoutes");
const path = require("path");

const app = express();

// Middleware to parse JSON
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Serve static files for uploaded avatars
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Allow frontend to call backend with credentials (for cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Main API routes
    app.use("/auth", authRoutes);
    app.use("/transactions", transactionRoutes);
    app.use("/profile", profileRoutes);
    app.use("/categories", categoryRoutes);
    app.use("/budgets", budgetRoutes);
    app.use("/goals", goalRoutes);
    app.use("/recurring", recurringRoutes);
    app.use("/ai", aiRoutes);
    app.use("/households", householdRoutes);

    // Base route (optional)
    app.get("/", (req, res) => {
      res.send("Finance Tracker Backend Running");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
};

startServer();
