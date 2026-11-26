const express = require("express");

const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

const router = express.Router();

router.post("/", addCustomer);

router.get("/", getCustomers);

router.get("/:customerId", getCustomerById);

router.put("/:customerId", updateCustomer);

router.delete("/:customerId", deleteCustomer);

module.exports = router;