const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    clothType: {
      type: String,
      required: true,
      unique: true
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    unit: {
      type: String,
      default: "Meters"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Stock", stockSchema);