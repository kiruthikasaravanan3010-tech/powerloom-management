const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    maintenanceId: {
      type: String,
      required: true,
      unique: true
    },

    machineId: {
      type: String,
      required: true
    },

    machineName: {
      type: String,
      required: true
    },

    maintenanceDate: {
      type: Date,
      required: true
    },

    issue: {
      type: String,
      required: true
    },

    technician: {
      type: String,
      default: ""
    },

    cost: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed"],
      default: "Scheduled"
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

module.exports = mongoose.model("Maintenance", maintenanceSchema);