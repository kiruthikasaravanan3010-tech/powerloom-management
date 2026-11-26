require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const User = require("./models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createOwner() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingOwner = await User.findOne({ role: "Owner" });

    if (existingOwner) {
      console.log("Owner account already exists.");
      return;
    }

    const username = (await ask("Enter Owner username: ")).trim();
    const password = await ask("Enter Owner password (minimum 8 characters): ");

    if (!username || password.length < 8) {
      console.log("Username is required and password must be at least 8 characters.");
      return;
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("Username already exists. Choose another username.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username,
      password: hashedPassword,
      role: "Owner"
    });

    console.log("Owner account created successfully!");
  } catch (error) {
    console.error("Owner setup failed:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

createOwner();