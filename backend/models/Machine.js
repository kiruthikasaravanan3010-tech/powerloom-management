const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true,
      unique: true
    },

    machineName: {
      type: String,
      required: true
    },

    operatorName: {
      type: String,
      default: ""
    },

    production: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Running", "Maintenance", "Stopped"],
      default: "Stopped"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Machine", machineSchema);