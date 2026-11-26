const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
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

    clothType: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    orderDate: {
      type: Date,
      required: true
    },

    deliveryDate: {
      type: Date,
      required: true
    },

    // Payment Details
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Bank Transfer",
        "Cash on Delivery"
      ],
      required: true
    },

    advanceAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    balanceAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    creditDays: {
      type: Number,
      default: 0,
      min: 0
    },

    dueDate: {
      type: Date,
      default: null
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Partial",
        "Paid",
        "Overdue"
      ],
      default: "Pending"
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Production",
        "Dispatched"
      ],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);