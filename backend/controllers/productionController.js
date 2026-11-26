const Production = require("../models/Production");

const {
  updateStockFromProduction
} = require("./stockController");


// ===============================
// ADD PRODUCTION
// ===============================

const addProduction = async (req, res) => {
  try {
    console.log("========== PRODUCTION DATA ==========");
    console.log(req.body);
    console.log("=====================================");

    const production = new Production(req.body);

    const savedProduction = await production.save();

    // Increase stock
    await updateStockFromProduction(
      savedProduction.clothType,
      savedProduction.productionQuantity
    );

    console.log("Production saved successfully");
    console.log("Stock updated successfully");

    res.status(201).json({
      message: "Production added successfully",
      production: savedProduction
    });

  } catch (error) {
    console.error("ADD PRODUCTION ERROR:", error);

    res.status(500).json({
      message: "Failed to add production",
      error: error.message
    });
  }
};


// ===============================
// GET ALL PRODUCTION
// ===============================

const getProduction = async (req, res) => {
  try {
    const productions = await Production.find()
      .sort({ date: -1 });

    res.status(200).json(productions);

  } catch (error) {
    console.error("GET PRODUCTION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch production",
      error: error.message
    });
  }
};


// ===============================
// PRODUCTION SUMMARY
// ===============================

const getProductionSummary = async (req, res) => {
  try {
    const productions = await Production.find();

    const totalProduction = productions.reduce(
      (total, item) =>
        total + item.productionQuantity,
      0
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayProduction = productions
      .filter((item) => {
        const date = new Date(item.date);

        date.setHours(0, 0, 0, 0);

        return date.getTime() === today.getTime();
      })
      .reduce(
        (total, item) =>
          total + item.productionQuantity,
        0
      );

    const machineProduction = {};

    productions.forEach((item) => {
      if (!machineProduction[item.machineNumber]) {
        machineProduction[item.machineNumber] = 0;
      }

      machineProduction[item.machineNumber] +=
        item.productionQuantity;
    });

    res.status(200).json({
      totalProduction,
      todayProduction,
      totalEntries: productions.length,
      machineProduction
    });

  } catch (error) {
    console.error(
      "PRODUCTION SUMMARY ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch production summary",
      error: error.message
    });
  }
};


// ===============================
// UPDATE PRODUCTION
// ===============================

const updateProduction = async (req, res) => {
  try {

    // Get old production
    const oldProduction =
      await Production.findById(req.params.id);

    if (!oldProduction) {
      return res.status(404).json({
        message: "Production record not found"
      });
    }


    // New values
    const newClothType =
      req.body.clothType ||
      oldProduction.clothType;

    const newQuantity =
      Number(
        req.body.productionQuantity
      );


    if (
      isNaN(newQuantity) ||
      newQuantity <= 0
    ) {
      return res.status(400).json({
        message:
          "Production quantity must be greater than 0"
      });
    }


    // =================================
    // CASE 1
    // SAME CLOTH TYPE
    // =================================

    if (
      oldProduction.clothType ===
      newClothType
    ) {

      const quantityDifference =
        newQuantity -
        oldProduction.productionQuantity;


      // Quantity increased
      if (quantityDifference > 0) {

        await updateStockFromProduction(
          newClothType,
          quantityDifference
        );
      }


      // Quantity decreased
      if (quantityDifference < 0) {

        await updateStockFromProduction(
          newClothType,
          quantityDifference
        );
      }
    }


    // =================================
    // CASE 2
    // CLOTH TYPE CHANGED
    // =================================

    if (
      oldProduction.clothType !==
      newClothType
    ) {

      // Remove old quantity
      await updateStockFromProduction(
        oldProduction.clothType,
        -oldProduction.productionQuantity
      );


      // Add new quantity
      await updateStockFromProduction(
        newClothType,
        newQuantity
      );
    }


    // =================================
    // UPDATE PRODUCTION RECORD
    // =================================

    const updatedProduction =
      await Production.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          clothType: newClothType,
          productionQuantity: newQuantity
        },
        {
          new: true,
          runValidators: true
        }
      );


    console.log(
      "Production updated successfully"
    );


    res.status(200).json({
      message:
        "Production updated successfully",
      production: updatedProduction
    });

  } catch (error) {

    console.error(
      "UPDATE PRODUCTION ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update production",
      error: error.message
    });
  }
};


// ===============================
// DELETE PRODUCTION
// ===============================

const deleteProduction = async (req, res) => {
  try {

    // Find production
    const production =
      await Production.findById(req.params.id);

    if (!production) {
      return res.status(404).json({
        message:
          "Production record not found"
      });
    }


    // =================================
    // REMOVE PRODUCTION FROM STOCK
    // =================================

    await updateStockFromProduction(
      production.clothType,
      -production.productionQuantity
    );


    // =================================
    // DELETE PRODUCTION
    // =================================

    await Production.findByIdAndDelete(
      req.params.id
    );


    console.log(
      "Production deleted successfully"
    );


    res.status(200).json({
      message:
        "Production deleted successfully"
    });

  } catch (error) {

    console.error(
      "DELETE PRODUCTION ERROR:",
      error
    );

    res.status(400).json({
      message:
        `Cannot delete production. ${error.message}`
    });
  }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  addProduction,
  getProduction,
  getProductionSummary,
  updateProduction,
  deleteProduction
};