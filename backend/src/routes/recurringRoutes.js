const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const ctrl = require("../controllers/recurringController");

router.get("/list", verifyToken, ctrl.getRecurring);
router.post("/add", verifyToken, ctrl.addRecurring);
router.post("/mark-paid/:id", verifyToken, ctrl.markPaid);
router.patch("/toggle/:id", verifyToken, ctrl.toggleActive);
router.delete("/delete/:id", verifyToken, ctrl.deleteRecurring);

module.exports = router;
