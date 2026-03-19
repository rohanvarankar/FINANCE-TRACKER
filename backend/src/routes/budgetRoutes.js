const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const budgetController = require("../controllers/budgetController");

router.get("/list", verifyToken, budgetController.getBudgets);
router.post("/add", verifyToken, budgetController.addBudget);
router.delete("/delete/:id", verifyToken, budgetController.deleteBudget);

module.exports = router;
