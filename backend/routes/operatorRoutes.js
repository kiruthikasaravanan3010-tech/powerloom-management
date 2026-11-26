const express = require("express");

const {
  addOperator,
  getOperators,
  getOperatorById,
  updateOperator,
  deleteOperator
} = require("../controllers/operatorController");

const router = express.Router();

router.post("/", addOperator);

router.get("/", getOperators);

router.get("/:operatorId", getOperatorById);

router.put("/:operatorId", updateOperator);

router.delete("/:operatorId", deleteOperator);

module.exports = router;