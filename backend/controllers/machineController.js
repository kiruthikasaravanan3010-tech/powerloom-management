const Machine = require("../models/Machine");

// Add Machine
const addMachine = async (req, res) => {
  try {
    const machine = new Machine(req.body);

    const savedMachine = await machine.save();

    res.status(201).json({
      message: "Machine added successfully",
      machine: savedMachine
    });
  } catch (error) {
    console.error("ADD MACHINE ERROR:", error);

    res.status(500).json({
      message: "Failed to add machine",
      error: error.message
    });
  }
};

// Get All Machines
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });

    res.status(200).json(machines);
  } catch (error) {
    console.error("GET MACHINES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch machines",
      error: error.message
    });
  }
};

// Get Single Machine
const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findOne({
      machineId: req.params.machineId
    });

    if (!machine) {
      return res.status(404).json({
        message: "Machine not found"
      });
    }

    res.status(200).json(machine);
  } catch (error) {
    console.error("GET MACHINE DETAILS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch machine details",
      error: error.message
    });
  }
};

// Update Machine
const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findOneAndUpdate(
      {
        machineId: req.params.machineId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!machine) {
      return res.status(404).json({
        message: "Machine not found"
      });
    }

    res.status(200).json({
      message: "Machine updated successfully",
      machine
    });
  } catch (error) {
    console.error("UPDATE MACHINE ERROR:", error);

    res.status(500).json({
      message: "Failed to update machine",
      error: error.message
    });
  }
};

// Delete Machine
const deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findOneAndDelete({
      machineId: req.params.machineId
    });

    if (!machine) {
      return res.status(404).json({
        message: "Machine not found"
      });
    }

    res.status(200).json({
      message: "Machine deleted successfully"
    });
  } catch (error) {
    console.error("DELETE MACHINE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete machine",
      error: error.message
    });
  }
};

module.exports = {
  addMachine,
  getMachines,
  getMachineById,
  updateMachine,
  deleteMachine
};