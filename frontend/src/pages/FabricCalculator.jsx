import { useState } from "react";

function FabricCalculator() {
  const [formData, setFormData] = useState({
    warpCount: "",
    weftCount: "",
    end: "",
    pick: "",
    width: "",
    weave: "",
    warpPrice: "",
    weftPrice: "",
    warpCrimp: "",
    weftCrimp: "",
    extraEnds: "",
    valueLoss: "",
    sizingCost: "",
    weavingCost: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value)
    });
  };

  const calculate = (e) => {
    e.preventDefault();

    const {
      warpCount,
      weftCount,
      end,
      pick,
      width,
      warpPrice,
      weftPrice,
      warpCrimp,
      weftCrimp,
      extraEnds,
      valueLoss,
      sizingCost,
      weavingCost
    } = formData;

    if (
      warpCount === "" ||
      weftCount === "" ||
      end === "" ||
      pick === "" ||
      width === "" ||
      warpPrice === "" ||
      weftPrice === "" ||
      warpCrimp === "" ||
      weftCrimp === "" ||
      extraEnds === "" ||
      valueLoss === "" ||
      sizingCost === "" ||
      weavingCost === ""
    ) {
      alert("Please enter all values.");
      return;
    }

    if (
      warpCount <= 0 ||
      weftCount <= 0 ||
      end <= 0 ||
      pick <= 0 ||
      width <= 0
    ) {
      alert("Please enter valid positive values.");
      return;
    }

    // Cotton Ne conversion factor
    const conversionFactor = 0.59054;

    // 1. Number of Ends
    const numberOfEnds = end * width;

    // 2. Total Warp Ends
    const totalWarpEnds = numberOfEnds + extraEnds;

    // 3. Warp Weight
    const warpGrams =
      (totalWarpEnds * conversionFactor / warpCount) *
      (1 + warpCrimp / 100);

    // 4. Weft Weight
    const weftGrams =
      (pick * width * conversionFactor / weftCount) *
      (1 + weftCrimp / 100);

    // 5. Warp Cost
    const warpCost =
      (warpGrams * warpPrice) / 1000;

    // 6. Weft Cost
    const weftCost =
      (weftGrams * weftPrice) / 1000;

    // 7. Sizing Cost
    const sizingCostValue =
      (warpGrams * sizingCost) / 1000;

    // 8. Weaving Cost
    const weavingCostValue =
      (pick * weavingCost) / 100;

    // 9. Subtotal
    const subtotal =
      warpCost +
      weftCost +
      sizingCostValue +
      weavingCostValue;

    // 10. Value Loss
    const valueLossAmount =
      subtotal * (valueLoss / 100);

    // 11. Total Price
    const totalPrice =
      subtotal + valueLossAmount;

    setResult({
      numberOfEnds,
      totalWarpEnds,
      warpGrams,
      weftGrams,
      warpCost,
      weftCost,
      sizingCostValue,
      weavingCostValue,
      subtotal,
      valueLossAmount,
      totalPrice
    });
  };

  const resetCalculator = () => {
    setFormData({
      warpCount: "",
      weftCount: "",
      end: "",
      pick: "",
      width: "",
      weave: "",
      warpPrice: "",
      weftPrice: "",
      warpCrimp: "",
      weftCrimp: "",
      extraEnds: "",
      valueLoss: "",
      sizingCost: "",
      weavingCost: ""
    });

    setResult(null);
  };

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Fabric Calculator</h1>
          <p>
            Calculate warp, weft and fabric production cost
          </p>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="content-card">

        <h2>Fabric Details</h2>

        <form onSubmit={calculate}>

          <div className="form-grid">

            <div className="form-group">
              <label>Warp Count</label>
              <input
                type="number"
                name="warpCount"
                step="0.01"
                value={formData.warpCount}
                onChange={handleChange}
                placeholder="20.0"
              />
            </div>

            <div className="form-group">
              <label>Weft Count</label>
              <input
                type="number"
                name="weftCount"
                step="0.01"
                value={formData.weftCount}
                onChange={handleChange}
                placeholder="20.0"
              />
            </div>

            <div className="form-group">
              <label>End</label>
              <input
                type="number"
                name="end"
                step="0.01"
                value={formData.end}
                onChange={handleChange}
                placeholder="44.0"
              />
            </div>

            <div className="form-group">
              <label>Pick</label>
              <input
                type="number"
                name="pick"
                step="0.01"
                value={formData.pick}
                onChange={handleChange}
                placeholder="36.0"
              />
            </div>

            <div className="form-group">
              <label>Width (inches)</label>
              <input
                type="number"
                name="width"
                step="0.01"
                value={formData.width}
                onChange={handleChange}
                placeholder="46.0"
              />
            </div>

            <div className="form-group">
              <label>Weave</label>
              <input
                type="number"
                name="weave"
                step="0.01"
                value={formData.weave}
                onChange={handleChange}
                placeholder="100.0"
              />
            </div>

            <div className="form-group">
              <label>Warp Price / Kg</label>
              <input
                type="number"
                name="warpPrice"
                step="0.01"
                value={formData.warpPrice}
                onChange={handleChange}
                placeholder="110.0"
              />
            </div>

            <div className="form-group">
              <label>Weft Price / Kg</label>
              <input
                type="number"
                name="weftPrice"
                step="0.01"
                value={formData.weftPrice}
                onChange={handleChange}
                placeholder="100.0"
              />
            </div>

            <div className="form-group">
              <label>Warp Crimp %</label>
              <input
                type="number"
                name="warpCrimp"
                step="0.01"
                value={formData.warpCrimp}
                onChange={handleChange}
                placeholder="2.0"
              />
            </div>

            <div className="form-group">
              <label>Weft Crimp %</label>
              <input
                type="number"
                name="weftCrimp"
                step="0.01"
                value={formData.weftCrimp}
                onChange={handleChange}
                placeholder="1.0"
              />
            </div>

            <div className="form-group">
              <label>Extra Ends</label>
              <input
                type="number"
                name="extraEnds"
                step="0.01"
                value={formData.extraEnds}
                onChange={handleChange}
                placeholder="20.0"
              />
            </div>

            <div className="form-group">
              <label>Value Loss %</label>
              <input
                type="number"
                name="valueLoss"
                step="0.01"
                value={formData.valueLoss}
                onChange={handleChange}
                placeholder="1.0"
              />
            </div>

            <div className="form-group">
              <label>Sizing Cost / Kg</label>
              <input
                type="number"
                name="sizingCost"
                step="0.01"
                value={formData.sizingCost}
                onChange={handleChange}
                placeholder="22.0"
              />
            </div>

            <div className="form-group">
              <label>Weaving Cost / Pick</label>
              <input
                type="number"
                name="weavingCost"
                step="0.01"
                value={formData.weavingCost}
                onChange={handleChange}
                placeholder="10.0"
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
            >
              Calculate
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={resetCalculator}
            >
              Reset
            </button>

          </div>

        </form>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="content-card">

          <h2>Calculation Result</h2>

          <div className="result-grid">

            <div className="result-item">
              <span>No. of Ends</span>
              <strong>
                {result.numberOfEnds.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Total Warp Ends</span>
              <strong>
                {result.totalWarpEnds.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Warp (gms)</span>
              <strong>
                {result.warpGrams.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Weft (gms)</span>
              <strong>
                {result.weftGrams.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Warp Cost</span>
              <strong>
                ₹{result.warpCost.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Weft Cost</span>
              <strong>
                ₹{result.weftCost.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Sizing Cost</span>
              <strong>
                ₹{result.sizingCostValue.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Weaving Cost</span>
              <strong>
                ₹{result.weavingCostValue.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Subtotal</span>
              <strong>
                ₹{result.subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="result-item">
              <span>Value Loss</span>
              <strong>
                ₹{result.valueLossAmount.toFixed(2)}
              </strong>
            </div>

            <div className="result-item total-result">
              <span>Total Price</span>
              <strong>
                ₹{result.totalPrice.toFixed(2)}
              </strong>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default FabricCalculator;