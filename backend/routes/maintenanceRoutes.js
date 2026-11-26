const express = require("express");

const {
  addMaintenance,
  getMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance
} = require("../controllers/maintenanceController");

const router = express.Router();

router.post("/", addMaintenance);

router.get("/", getMaintenance);

router.get("/:maintenanceId", getMaintenanceById);

router.put("/:maintenanceId", updateMaintenance);

router.delete("/:maintenanceId", deleteMaintenance);

module.exports = router;