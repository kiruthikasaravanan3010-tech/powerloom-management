const Stock = require("../models/Stock");

// ===============================
// GET ALL STOCK
// ===============================

const getStock = async (req, res) => {
  try {
    const stock = await Stock.find().sort({
      clothType: 1
    });

    res.status(200).json(stock);

  } catch (error) {
    console.error("GET STOCK ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch stock",
      error: error.message
    });
  }
};


// ===============================
// ADD STOCK MANUALLY
// ===============================

const addStock = async (req, res) => {
  try {
    const {
      clothType,
      quantity
    } = req.body;

    // Check required fields
    if (
      !clothType ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message: "Cloth type and quantity are required"
      });
    }

    const stockQuantity = Number(quantity);

    // Validate quantity
    if (
      isNaN(stockQuantity) ||
      stockQuantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    // Find existing stock and increase quantity
    const stock = await Stock.findOneAndUpdate(
      {
        clothType: clothType
      },
      {
        $inc: {
          quantity: stockQuantity
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: "Stock updated successfully",
      stock
    });

  } catch (error) {
    console.error("ADD STOCK ERROR:", error);

    res.status(500).json({
      message: "Failed to update stock",
      error: error.message
    });
  }
};


// ===============================
// UPDATE STOCK FROM PRODUCTION
// ===============================

const updateStockFromProduction = async (
  clothType,
  quantity
) => {

  // Check cloth type
  if (
    !clothType ||
    quantity === undefined
  ) {
    throw new Error(
      "Cloth type and quantity are required"
    );
  }

  const changeQuantity = Number(quantity);

  // Check quantity
  if (
    isNaN(changeQuantity) ||
    changeQuantity === 0
  ) {
    throw new Error(
      "Stock quantity change must be a valid non-zero number"
    );
  }


  // ===============================
  // FIND EXISTING STOCK
  // ===============================

  let existingStock = await Stock.findOne({
    clothType: clothType
  });


  // ===============================
  // ADD STOCK
  // ===============================

  if (changeQuantity > 0) {

    // Stock does not exist
    if (!existingStock) {

      const newStock = await Stock.create({
        clothType: clothType,
        quantity: changeQuantity
      });

      return newStock;
    }


    // Existing stock
    const currentQuantity =
      Number(existingStock.quantity);

    existingStock.quantity =
      currentQuantity + changeQuantity;

    await existingStock.save();

    return existingStock;
  }


  // ===============================
  // REDUCE STOCK
  // ===============================

  if (changeQuantity < 0) {

    // Stock does not exist
    if (!existingStock) {

      // Do not stop production
      // delete/update operation
      return null;
    }

    const currentQuantity =
      Number(existingStock.quantity);

    const removeQuantity =
      Math.abs(changeQuantity);


    // ===============================
    // REMOVE AVAILABLE STOCK ONLY
    // ===============================

    const actualRemoveQuantity =
      Math.min(
        currentQuantity,
        removeQuantity
      );


    // Reduce stock
    existingStock.quantity =
      currentQuantity -
      actualRemoveQuantity;

    await existingStock.save();

    return existingStock;
  }
};


// ===============================
// REDUCE STOCK FOR DISPATCH
// ===============================

const reduceStockForDispatch = async (
  clothType,
  quantity
) => {

  // Check required fields
  if (
    !clothType ||
    quantity === undefined
  ) {
    throw new Error(
      "Cloth type and quantity are required"
    );
  }

  const dispatchQuantity =
    Number(quantity);

  // Validate quantity
  if (
    isNaN(dispatchQuantity) ||
    dispatchQuantity <= 0
  ) {
    throw new Error(
      "Dispatch quantity must be greater than 0"
    );
  }


  // ===============================
  // FIND STOCK
  // ===============================

  const existingStock =
    await Stock.findOne({
      clothType: clothType
    });

  if (!existingStock) {
    throw new Error(
      `No stock available for ${clothType}`
    );
  }


  const currentQuantity =
    Number(existingStock.quantity);


  // ===============================
  // CHECK AVAILABLE STOCK
  // ===============================

  if (
    currentQuantity <
    dispatchQuantity
  ) {
    throw new Error(
      `Insufficient stock for ${clothType}. Available: ${currentQuantity} pieces, Required: ${dispatchQuantity} pieces`
    );
  }


  // ===============================
  // DEDUCT STOCK
  // ===============================

  existingStock.quantity =
    currentQuantity -
    dispatchQuantity;

  await existingStock.save();

  return existingStock;
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  getStock,
  addStock,
  updateStockFromProduction,
  reduceStockForDispatch
};