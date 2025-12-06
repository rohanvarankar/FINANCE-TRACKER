// backend/src/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");

// Protected Routes
router.post("/add", authMiddleware, transactionController.addTransaction);

// list with filters, pagination, search, sort
router.get("/list", authMiddleware, transactionController.getTransactions);

// update by id
router.put("/update/:id", authMiddleware, transactionController.updateTransaction);

// delete by id
router.delete("/delete/:id", authMiddleware, transactionController.deleteTransaction);

// monthly summary (income/expense totals per month — optional)
router.get("/summary/monthly", authMiddleware, transactionController.monthlySummary);

module.exports = router;
