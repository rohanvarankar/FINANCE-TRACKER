const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const goalController = require("../controllers/goalController");

router.get("/list", verifyToken, goalController.getGoals);
router.post("/add", verifyToken, goalController.addGoal);
router.put("/update/:id", verifyToken, goalController.updateGoal);
router.delete("/delete/:id", verifyToken, goalController.deleteGoal);

module.exports = router;
