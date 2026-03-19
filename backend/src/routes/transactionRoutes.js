// backend/src/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");
const upload = require("../middleware/upload");

// Protected Routes
router.post("/add", authMiddleware, transactionController.addTransaction);

// list with filters, pagination, search, sort
router.get("/list", authMiddleware, transactionController.getTransactions);

// update by id
router.put("/update/:id", authMiddleware, transactionController.updateTransaction);

// delete by id
router.delete("/delete/:id", authMiddleware, transactionController.deleteTransaction);

// monthly summary (income/expense totals per month)
router.get("/summary/monthly", authMiddleware, transactionController.monthlySummary);

// global summary (total income, expense, balance)
router.get("/summary", authMiddleware, transactionController.getSummary);

// upload receipt
router.post("/upload-receipt/:id", authMiddleware, upload.single("receipt"), transactionController.uploadReceipt);

module.exports = router;
