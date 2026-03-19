const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
// PROTECTED ROUTES (AI Advisor & Chat)
router.get("/advisor", authMiddleware, aiController.getAdvisorInsight);
router.post("/chatbot", authMiddleware, aiController.getChatbotResponse);
router.post("/process-text", authMiddleware, aiController.processTransactionText);

module.exports = router;
