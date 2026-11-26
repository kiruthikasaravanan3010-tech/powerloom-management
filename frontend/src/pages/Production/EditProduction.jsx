import { useEffect, useState } from "react";

function EditProduction({ productionId, setPage }) {
  const [formData, setFormData] = useState({
    date: "",
    shift: "Morning",
    machineNumber: "",
    operatorName: "",
    clothType: "",
    productionQuantity: "",
    remarks: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/production`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch production");
        }

        const data = await response.json();

        const production = data.find(
          (item) => item._id === productionId
        );

        if (!production) {
          throw new Error("Production record not found");
        }

        setFormData({
          date: production.date
            ? production.date.substring(0, 10)
            : "",
          shift: production.shift || "Morning",
          machineNumber: production.machineNumber || "",
          operatorName: production.operatorName || "",
          clothType: production.clothType || "",
          productionQuantity:
            production.productionQuantity || "",
          remarks: production.remarks || ""
        });

      } catch (error) {
        console.error("Fetch production error:", error);
        alert("Failed to load production record");
      } finally {
        setLoading(false);
      }
    };

    if (productionId) {
      fetchProduction();
    }
  }, [productionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.machineNumber ||
      !formData.operatorName ||
      !formData.clothType ||
      !formData.productionQuantity
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/production/${productionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            productionQuantity: Number(
              formData.productionQuantity
            )
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update production"
        );
      }

      alert("Production updated successfully");

      setPage("production-history");

    } catch (error) {
      console.error("Update production error:", error);
      alert("Failed to update production");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading production...</p>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Edit Production</h1>
          <p>Update production record</p>
        </div>
      </div>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Shift</label>

              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="Morning">
                  Morning
                </option>

                <option value="Afternoon">
                  Afternoon
                </option>

                <option value="Night">
                  Night
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Machine Number</label>

              <input
                type="text"
                name="machineNumber"
                value={formData.machineNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Operator Name</label>

              <input
                type="text"
                name="operatorName"
                value={formData.operatorName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cloth Type</label>

              <input
                type="text"
                name="clothType"
                value={formData.clothType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Production Quantity</label>

              <input
                type="number"
                name="productionQuantity"
                min="0"
                value={formData.productionQuantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Remarks</label>

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks"
              />
            </div>

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px"
            }}
          >

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Production"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setPage("production-history")
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduction;