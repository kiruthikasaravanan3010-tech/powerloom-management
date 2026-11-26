const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Bank Transfer"
      ],
      required: true
    },

    paymentDate: {
      type: Date,
      required: true
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

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);