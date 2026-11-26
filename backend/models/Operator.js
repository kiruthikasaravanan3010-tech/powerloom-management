const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema(
  {
    operatorId: {
      type: String,
      required: true,
      unique: true
    },

    operatorName: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      default: ""
    },

    assignedMachine: {
      type: String,
      default: ""
    },

    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Night"],
      default: "Morning"
    },

    joiningDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Operator", operatorSchema);