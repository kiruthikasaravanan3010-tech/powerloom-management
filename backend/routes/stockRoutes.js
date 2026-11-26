const express = require("express");

const {
  getStock,
  addStock
} = require("../controllers/stockController");

const router = express.Router();

router.get("/", getStock);

router.post("/add", addStock);

module.exports = router;