const Maintenance = require("../models/Maintenance");

// Add Maintenance
const addMaintenance = async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);

    const savedMaintenance = await maintenance.save();

    res.status(201).json({
      message: "Maintenance record added successfully",
      maintenance: savedMaintenance
    });
  } catch (error) {
    console.error("ADD MAINTENANCE ERROR:", error);

    res.status(500).json({
      message: "Failed to add maintenance record",
      error: error.message
    });
  }
};

// Get All Maintenance
const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find().sort({
      maintenanceDate: -1
    });

    res.status(200).json(maintenance);
  } catch (error) {
    console.error("GET MAINTENANCE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch maintenance records",
      error: error.message
    });
  }
};

// Get Single Maintenance
const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findOne({
      maintenanceId: req.params.maintenanceId
    });

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance record not found"
      });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    console.error("GET MAINTENANCE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch maintenance record",
      error: error.message
    });
  }
};

// Update Maintenance
const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findOneAndUpdate(
      {
        maintenanceId: req.params.maintenanceId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance record not found"
      });
    }

    res.status(200).json({
      message: "Maintenance updated successfully",
      maintenance
    });
  } catch (error) {
    console.error("UPDATE MAINTENANCE ERROR:", error);

    res.status(500).json({
      message: "Failed to update maintenance",
      error: error.message
    });
  }
};

// Delete Maintenance
const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findOneAndDelete({
      maintenanceId: req.params.maintenanceId
    });

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance record not found"
      });
    }

    res.status(200).json({
      message: "Maintenance deleted successfully"
    });
  } catch (error) {
    console.error("DELETE MAINTENANCE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete maintenance",
      error: error.message
    });
  }
};

module.exports = {
  addMaintenance,
  getMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance
};