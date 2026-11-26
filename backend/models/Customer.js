const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true
    },

    customerName: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      default: ""
    },

    totalOrders: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);