import { useState, useEffect } from "react";

const SETTINGS_KEY = "powerloomSettings";

const ALLOWED_SHIFTS = [
  "Morning",
  "Night"
];

const ALLOWED_CLOTH_TYPES = [
  "Vesti",
  "Lungi",
  "Jari Vesti",
  "Printed Vesti",
  "kerala saree",
  "Other"
];

const getProductionDefaults = () => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    const settings = savedSettings
      ? JSON.parse(savedSettings)
      : {};

    return {
      shift: ALLOWED_SHIFTS.includes(settings.defaultShift)
        ? settings.defaultShift
        : "",

      clothType: ALLOWED_CLOTH_TYPES.includes(
        settings.defaultClothType
      )
        ? settings.defaultClothType
        : "",

      productionUnit: ["Pieces", "Metres"].includes(
        settings.productionUnit
      )
        ? settings.productionUnit
        : "Pieces",

      machineNamingFormat: [
        "Machine 01",
        "M-01",
        "Loom-01"
      ].includes(settings.machineNamingFormat)
        ? settings.machineNamingFormat
        : "Machine 01"
    };
  } catch (error) {
    console.error("Unable to load production settings:", error);

    return {
      shift: "",
      clothType: "",
      productionUnit: "Pieces",
      machineNamingFormat: "Machine 01"
    };
  }
};

function AddProduction() {
  const [productionDefaults, setProductionDefaults] = useState(
    getProductionDefaults
  );

  const createEmptyForm = (defaults = productionDefaults) => ({
    date: "",
    shift: defaults.shift,
    machineNumber: "",
    operatorName: "",
    clothType: defaults.clothType,
    productionQuantity: "",
    remarks: ""
  });

  const [formData, setFormData] = useState(() =>
    createEmptyForm(getProductionDefaults())
  );

  // Reload defaults whenever the user returns to this page
  useEffect(() => {
    const loadSettings = () => {
      const defaults = getProductionDefaults();

      setProductionDefaults(defaults);

      setFormData((previousData) => ({
        ...previousData,
        shift: previousData.shift || defaults.shift,
        clothType: previousData.clothType || defaults.clothType
      }));
    };

    loadSettings();

    // Detect settings changed in another browser tab
    window.addEventListener("storage", loadSettings);

    return () => {
      window.removeEventListener("storage", loadSettings);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quantity = Number(formData.productionQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert("Production quantity must be greater than 0.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/production",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: formData.date,
            shift: formData.shift,
            machineNumber: formData.machineNumber.trim(),
            operatorName: formData.operatorName.trim(),
            clothType: formData.clothType,
            productionQuantity: quantity,
            remarks: formData.remarks.trim()
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Production added and stock updated successfully!"
        );

        setFormData(createEmptyForm());
      } else {
        alert(
          data.error ||
          data.message ||
          "Failed to add production."
        );
      }
    } catch (error) {
      console.error("Frontend error:", error);
      alert("Cannot connect to backend.");
    }
  };

  const unit = productionDefaults.productionUnit;

  const machinePlaceholder = {
    "Machine 01": "Example: Machine 01",
    "M-01": "Example: M-01",
    "Loom-01": "Example: Loom-01"
  }[productionDefaults.machineNamingFormat];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add Production</h1>
          <p>Enter daily machine production details</p>
        </div>
      </div>

      <div className="content-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Date */}
            <div className="form-group">
              <label htmlFor="production-date">Date</label>

              <input
                id="production-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Shift */}
            <div className="form-group">
              <label htmlFor="production-shift">Shift</label>

              <select
                id="production-shift"
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                required
              >
                <option value="">Select Shift</option>
                {ALLOWED_SHIFTS.map((shift) => (
                  <option value={shift} key={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>

            {/* Machine Number */}
            <div className="form-group">
              <label htmlFor="machine-number">
                Machine Number
              </label>

              <input
                id="machine-number"
                type="text"
                name="machineNumber"
                placeholder={machinePlaceholder}
                value={formData.machineNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Operator Name */}
            <div className="form-group">
              <label htmlFor="operator-name">
                Operator Name
              </label>

              <input
                id="operator-name"
                type="text"
                name="operatorName"
                placeholder="Enter operator name"
                value={formData.operatorName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Cloth Type */}
            <div className="form-group">
              <label htmlFor="cloth-type">Cloth Type</label>

              <select
                id="cloth-type"
                name="clothType"
                value={formData.clothType}
                onChange={handleChange}
                required
              >
                <option value="">Select Cloth Type</option>

                {ALLOWED_CLOTH_TYPES.map((clothType) => (
                  <option value={clothType} key={clothType}>
                    {clothType}
                  </option>
                ))}
              </select>
            </div>

            {/* Production Quantity */}
            <div className="form-group">
              <label htmlFor="production-quantity">
                Production Quantity ({unit.toLowerCase()})
              </label>

              <input
                id="production-quantity"
                type="number"
                name="productionQuantity"
                placeholder={`Enter quantity in ${unit.toLowerCase()}`}
                min="1"
                step="1"
                value={formData.productionQuantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label htmlFor="production-remarks">Remarks</label>

            <textarea
              id="production-remarks"
              name="remarks"
              placeholder="Enter remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* Save Button */}
          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Save Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduction;