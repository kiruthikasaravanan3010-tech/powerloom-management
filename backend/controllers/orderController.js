const Order = require("../models/Order");
const Customer = require("../models/Customer");

const {
  reduceStockForDispatch
} = require("./stockController");


// ===============================
// ADD ORDER
// ===============================

const addOrder = async (req, res) => {
  try {
    const {
      orderId,
      customerName,
      location,
      clothType,
      quantity,
      orderDate,
      deliveryDate,

      // Payment Details
      totalAmount,
      paymentMethod,
      advanceAmount,
      balanceAmount,
      creditDays,
      dueDate,
      paymentStatus,

      status
    } = req.body;


    // Check customer exists
    const customer = await Customer.findOne({
      customerName: customerName
    });

    if (!customer) {
      return res.status(404).json({
        message:
          "Customer not found. Please add the customer first."
      });
    }


    // Create order
    const order = new Order({
      orderId,
      customerName,
      location,
      clothType,
      quantity,
      orderDate,
      deliveryDate,

      // Payment Details
      totalAmount,
      paymentMethod,
      advanceAmount,
      balanceAmount,
      creditDays,
      dueDate,
      paymentStatus,

      status
    });


    const savedOrder = await order.save();


    // Automatically increase customer total orders
    customer.totalOrders =
      Number(customer.totalOrders || 0) + 1;

    await customer.save();


    res.status(201).json({
      message: "Order added successfully",
      order: savedOrder
    });

  } catch (error) {

    console.error(
      "ADD ORDER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to add order",
      error: error.message
    });
  }
};


// ===============================
// GET ALL ORDERS
// ===============================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1
    });

    const ordersWithPhone = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          customerName: order.customerName
        });

        return {
          ...order.toObject(),
          phoneNumber: customer
            ? customer.phoneNumber
            : ""
        };
      })
    );

    res.status(200).json(ordersWithPhone);

  } catch (error) {

    console.error(
      "GET ORDERS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// ===============================
// GET SINGLE ORDER
// ===============================

const getOrderById = async (req, res) => {
  try {

    const order =
      await Order.findOne({
        orderId: req.params.orderId
      });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);

  } catch (error) {

    console.error(
      "GET ORDER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message
    });
  }
};


// ===============================
// UPDATE ORDER
// ===============================

const updateOrder = async (req, res) => {
  try {

    const order =
      await Order.findOne({
        orderId: req.params.orderId
      });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }


    // Prevent changing an already dispatched order
    // back to another status

    if (
      order.status === "Dispatched" &&
      req.body.status &&
      req.body.status !== "Dispatched"
    ) {

      return res.status(400).json({
        message:
          "A dispatched order cannot be changed back to another status"
      });
    }


    const updatedOrder =
      await Order.findOneAndUpdate(
        {
          orderId: req.params.orderId
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );


    res.status(200).json({
      message:
        "Order updated successfully",

      order: updatedOrder
    });

  } catch (error) {

    console.error(
      "UPDATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update order",

      error:
        error.message
    });
  }
};


// ===============================
// DISPATCH ORDER
// ===============================

const dispatchOrder = async (req, res) => {
  try {

    const order =
      await Order.findOne({
        orderId: req.params.orderId
      });


    if (!order) {

      return res.status(404).json({
        message:
          "Order not found"
      });

    }


    // Already dispatched check

    if (
      order.status === "Dispatched"
    ) {

      return res.status(400).json({
        message:
          "This order has already been dispatched"
      });

    }


    // Check stock and reduce stock

    try {

      await reduceStockForDispatch(
        order.clothType,
        order.quantity
      );

    } catch (stockError) {

      return res.status(400).json({
        message:
          stockError.message
      });

    }


    // Update order status

    order.status =
      "Dispatched";

    const updatedOrder =
      await order.save();


    res.status(200).json({

      message:
        "Order dispatched and stock updated successfully",

      order:
        updatedOrder

    });

  } catch (error) {

    console.error(
      "DISPATCH ORDER ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to dispatch order",

      error:
        error.message

    });

  }
};


// ===============================
// DELETE ORDER
// ===============================

const deleteOrder = async (req, res) => {
  try {

    const order =
      await Order.findOne({
        orderId:
          req.params.orderId
      });


    if (!order) {

      return res.status(404).json({
        message:
          "Order not found"
      });

    }


    // Delete order

    await Order.deleteOne({
      orderId:
        req.params.orderId
    });


    // Find customer

    const customer =
      await Customer.findOne({
        customerName:
          order.customerName
      });


    // Decrease total orders

    if (customer) {

      customer.totalOrders =
        Math.max(
          0,
          Number(
            customer.totalOrders || 0
          ) - 1
        );

      await customer.save();
    }


    res.status(200).json({
      message:
        "Order deleted successfully"
    });

  } catch (error) {

    console.error(
      "DELETE ORDER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete order",

      error:
        error.message
    });
  }
};


module.exports = {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  dispatchOrder,
  deleteOrder
};