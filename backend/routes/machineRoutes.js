const express = require("express");

const {
  addMachine,
  getMachines,
  getMachineById,
  updateMachine,
  deleteMachine
} = require("../controllers/machineController");

const router = express.Router();

router.post("/", addMachine);

router.get("/", getMachines);

router.get("/:machineId", getMachineById);

router.put("/:machineId", updateMachine);

router.delete("/:machineId", deleteMachine);

module.exports = router;