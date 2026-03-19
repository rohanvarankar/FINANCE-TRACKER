const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");

router.get("/list", verifyToken, categoryController.getCategories);
router.post("/add", verifyToken, categoryController.addCategory);
router.delete("/delete/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;
