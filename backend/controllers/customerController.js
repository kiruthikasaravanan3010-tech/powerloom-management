const Customer = require("../models/Customer");

// Add Customer
const addCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);

    const savedCustomer = await customer.save();

    res.status(201).json({
      message: "Customer added successfully",
      customer: savedCustomer
    });
  } catch (error) {
    console.error("ADD CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Failed to add customer",
      error: error.message
    });
  }
};

// Get All Customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("GET CUSTOMERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message
    });
  }
};

// Get Single Customer
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customerId: req.params.customerId
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("GET CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch customer",
      error: error.message
    });
  }
};

// Update Customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      {
        customerId: req.params.customerId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer
    });
  } catch (error) {
    console.error("UPDATE CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Failed to update customer",
      error: error.message
    });
  }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      customerId: req.params.customerId
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error("DELETE CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete customer",
      error: error.message
    });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};