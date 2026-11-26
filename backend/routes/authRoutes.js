const express = require("express");

const router = express.Router();

const {
  registerOwner,
  login,
  changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Create the first Owner account
router.post("/register-owner", registerOwner);

// Login
router.post("/login", login);

// Change password - login required
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;