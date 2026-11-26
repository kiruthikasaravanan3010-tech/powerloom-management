const express = require("express");

const {
  addProduction,
  getProduction,
  getProductionSummary,
  updateProduction,
  deleteProduction
} = require("../controllers/productionController");

const router = express.Router();

router.post("/", addProduction);

router.get("/", getProduction);

router.get("/summary", getProductionSummary);

router.put("/:id", updateProduction);

router.delete("/:id", deleteProduction);

module.exports = router;