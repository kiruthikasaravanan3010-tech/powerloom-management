const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["Owner", "Supervisor", "Operator"],
      default: "Owner"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);