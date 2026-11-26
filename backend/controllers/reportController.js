const Production = require("../models/Production");

const getDailyReport = async (req, res) => {
  try {
    const productions = await Production.find().sort({ date: -1 });

    const dailyData = {};

    productions.forEach((item) => {
      const date = new Date(item.date)
        .toISOString()
        .split("T")[0];

      if (!dailyData[date]) {
        dailyData[date] = 0;
      }

      dailyData[date] += item.productionQuantity;
    });

    res.status(200).json(dailyData);
  } catch (error) {
    console.error("DAILY REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch daily report",
      error: error.message
    });
  }
};


const getWeeklyReport = async (req, res) => {
  try {
    const productions = await Production.find();

    const weeklyData = {};

    productions.forEach((item) => {
      const date = new Date(item.date);

      const year = date.getFullYear();

      const startOfYear = new Date(year, 0, 1);

      const dayOfYear =
        Math.floor(
          (date - startOfYear) / (1000 * 60 * 60 * 24)
        ) + 1;

      const weekNumber = Math.ceil(dayOfYear / 7);

      const weekKey = `${year}-Week-${weekNumber}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0;
      }

      weeklyData[weekKey] += item.productionQuantity;
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    console.error("WEEKLY REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch weekly report",
      error: error.message
    });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const productions = await Production.find();

    const monthlyData = {};

    productions.forEach((item) => {
      const date = new Date(item.date);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const monthKey = `${year}-${String(month).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }

      monthlyData[monthKey] += item.productionQuantity;
    });

    res.status(200).json(monthlyData);
  } catch (error) {
    console.error("MONTHLY REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch monthly report",
      error: error.message
    });
  }
};


const getMachineReport = async (req, res) => {
  try {
    const productions = await Production.find();

    const machineData = {};

    productions.forEach((item) => {
      if (!machineData[item.machineNumber]) {
        machineData[item.machineNumber] = 0;
      }

      machineData[item.machineNumber] +=
        item.productionQuantity;
    });

    res.status(200).json(machineData);
  } catch (error) {
    console.error("MACHINE REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch machine report",
      error: error.message
    });
  }
};


module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getMachineReport
};