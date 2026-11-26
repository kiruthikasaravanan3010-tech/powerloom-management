const express = require("express");

const {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getMachineReport
} = require("../controllers/reportController");

const router = express.Router();

router.get("/daily", getDailyReport);

router.get("/weekly", getWeeklyReport);

router.get("/monthly", getMonthlyReport);

router.get("/machine", getMachineReport);

module.exports = router;