const express = require("express");

const {
  addPayment,
  getPaymentsByOrder
} = require("../controllers/paymentController");

const router = express.Router();


// Add new payment
router.post("/", addPayment);


// Get payment history for an order
router.get("/:orderId", getPaymentsByOrder);


module.exports = router;