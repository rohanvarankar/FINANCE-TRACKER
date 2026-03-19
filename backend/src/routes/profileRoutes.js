const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");
const upload = require("../middleware/upload");

router.get("/", authMiddleware, profileController.getProfile);
router.post("/update", authMiddleware, profileController.updateProfile);
router.post("/change-password", authMiddleware, profileController.changePassword);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), profileController.uploadAvatar);

module.exports = router;
