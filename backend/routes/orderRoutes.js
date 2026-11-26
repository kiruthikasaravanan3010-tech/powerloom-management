const express = require("express");

const {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  dispatchOrder,
  deleteOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", addOrder);

router.get("/", getOrders);

router.get("/:orderId", getOrderById);

router.put("/:orderId", updateOrder);

router.put("/:orderId/dispatch", dispatchOrder);

router.delete("/:orderId", deleteOrder);

module.exports = router;