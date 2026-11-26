const Payment = require("../models/Payment");
const Order = require("../models/Order");


// ===============================
// ADD PAYMENT
// ===============================

const addPayment = async (req, res) => {
  try {
    const {
      orderId,
      amount,
      paymentMethod,
      paymentDate,
      remarks
    } = req.body;


    // Check order exists
    const order = await Order.findOne({
      orderId: orderId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }


    const paymentAmount = Number(amount);


    // Validate amount
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        message:
          "Payment amount must be greater than 0"
      });
    }


    // Check payment does not exceed balance
    const currentBalance =
      Number(order.balanceAmount || 0);

    if (paymentAmount > currentBalance) {
      return res.status(400).json({
        message:
          `Payment cannot be greater than balance amount ₹${currentBalance}`
      });
    }


    // Create payment record
    const payment = new Payment({
      orderId,
      amount: paymentAmount,
      paymentMethod,
      paymentDate,
      remarks
    });


    const savedPayment =
      await payment.save();


    // Update order payment details
    const currentPaid =
      Number(order.advanceAmount || 0);

    const newPaid =
      currentPaid + paymentAmount;

    const newBalance =
      Number(order.totalAmount) - newPaid;


    order.advanceAmount = newPaid;
    order.balanceAmount =
      Math.max(0, newBalance);


    // Update payment status
    if (order.balanceAmount === 0) {

      order.paymentStatus = "Paid";

    } else if (newPaid > 0) {

      order.paymentStatus = "Partial";

    } else {

      order.paymentStatus = "Pending";
    }


    await order.save();


    res.status(201).json({
      message:
        "Payment added successfully",

      payment:
        savedPayment,

      order:
        order
    });

  } catch (error) {

    console.error(
      "ADD PAYMENT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to add payment",

      error:
        error.message
    });
  }
};


// ===============================
// GET PAYMENTS FOR ORDER
// ===============================

const getPaymentsByOrder = async (req, res) => {
  try {

    const payments =
      await Payment.find({
        orderId:
          req.params.orderId
      }).sort({
        paymentDate: -1
      });


    res.status(200).json(
      payments
    );

  } catch (error) {

    console.error(
      "GET PAYMENTS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch payment history",

      error:
        error.message
    });
  }
};


module.exports = {
  addPayment,
  getPaymentsByOrder
};