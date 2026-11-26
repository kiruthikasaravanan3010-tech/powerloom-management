const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create the first Owner account
const registerOwner = async (req, res) => {
  try {
    const { username, password } = req.body;

    const setupSecret = req.headers["x-setup-secret"];

if (
  !process.env.OWNER_SETUP_SECRET ||
  setupSecret !== process.env.OWNER_SETUP_SECRET
) {
  return res.status(403).json({
    message: "Owner registration is not authorized."
  });
}

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters."
      });
    }

    const existingOwner = await User.findOne({ role: "Owner" });

    if (existingOwner) {
      return res.status(403).json({
        message: "Owner account already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.trim(),
      password: hashedPassword,
      role: "Owner"
    });

    return res.status(201).json({
      message: "Owner account created successfully.",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Owner registration error:", error);

    return res.status(500).json({
      message: "Unable to create owner account."
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const user = await User.findOne({
      username: username.trim()
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      return res.status(500).json({
        message: "Authentication is not configured."
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in."
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new passwords are required."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must contain at least 8 characters."
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must differ from the current password."
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Current password is incorrect."
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({
      message: "Password changed successfully. Please log in again."
    });
  } catch (error) {
    console.error("Password change error:", error);

    return res.status(500).json({
      message: "Unable to change password."
    });
  }
};

module.exports = {
  registerOwner,
  login,
  changePassword
};