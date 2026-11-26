const Operator = require("../models/Operator");

// Add Operator
const addOperator = async (req, res) => {
  try {
    const operator = new Operator(req.body);

    const savedOperator = await operator.save();

    res.status(201).json({
      message: "Operator added successfully",
      operator: savedOperator
    });
  } catch (error) {
    console.error("ADD OPERATOR ERROR:", error);

    res.status(500).json({
      message: "Failed to add operator",
      error: error.message
    });
  }
};

// Get All Operators
const getOperators = async (req, res) => {
  try {
    const operators = await Operator.find().sort({
      createdAt: -1
    });

    res.status(200).json(operators);
  } catch (error) {
    console.error("GET OPERATORS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch operators",
      error: error.message
    });
  }
};

// Get Single Operator
const getOperatorById = async (req, res) => {
  try {
    const operator = await Operator.findOne({
      operatorId: req.params.operatorId
    });

    if (!operator) {
      return res.status(404).json({
        message: "Operator not found"
      });
    }

    res.status(200).json(operator);
  } catch (error) {
    console.error("GET OPERATOR ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch operator",
      error: error.message
    });
  }
};

// Update Operator
const updateOperator = async (req, res) => {
  try {
    const operator = await Operator.findOneAndUpdate(
      {
        operatorId: req.params.operatorId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!operator) {
      return res.status(404).json({
        message: "Operator not found"
      });
    }

    res.status(200).json({
      message: "Operator updated successfully",
      operator
    });
  } catch (error) {
    console.error("UPDATE OPERATOR ERROR:", error);

    res.status(500).json({
      message: "Failed to update operator",
      error: error.message
    });
  }
};

// Delete Operator
const deleteOperator = async (req, res) => {
  try {
    const operator = await Operator.findOneAndDelete({
      operatorId: req.params.operatorId
    });

    if (!operator) {
      return res.status(404).json({
        message: "Operator not found"
      });
    }

    res.status(200).json({
      message: "Operator deleted successfully"
    });
  } catch (error) {
    console.error("DELETE OPERATOR ERROR:", error);

    res.status(500).json({
      message: "Failed to delete operator",
      error: error.message
    });
  }
};

module.exports = {
  addOperator,
  getOperators,
  getOperatorById,
  updateOperator,
  deleteOperator
};