const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");
const authMiddleware = require("../middleware/authMiddleware");

// PROTECTED ROUTES (Household)
router.post("/create", authMiddleware, householdController.createHousehold);
router.post("/join", authMiddleware, householdController.joinHousehold);
router.get("/details", authMiddleware, householdController.getHousehold);
router.post("/leave", authMiddleware, householdController.leaveHousehold);

module.exports = router;
