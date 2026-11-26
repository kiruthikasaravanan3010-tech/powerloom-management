const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },

    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Afternoon", "Night"]
    },

    machineNumber: {
      type: String,
      required: true
    },

    operatorName: {
      type: String,
      required: true
    },

    clothType: {
      type: String,
      required: true
    },

    productionQuantity: {
      type: Number,
      required: true,
      min: 0
    },

    remarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Production", productionSchema);