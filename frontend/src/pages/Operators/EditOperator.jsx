import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

function EditOperator({ operatorId, setPage }) {
  const [formData, setFormData] = useState({
    operatorId: "",
    operatorName: "",
    phoneNumber: "",
    assignedMachine: "",
    shift: "Morning",
    joiningDate: "",
    status: "Active"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch operator details
  const fetchOperator = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://powerloom-management.onrender.com/api/operators/${operatorId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch operator");
      }

      const data = await response.json();

      setFormData({
        operatorId: data.operatorId || "",
        operatorName: data.operatorName || "",
        phoneNumber: data.phoneNumber || "",
        assignedMachine: data.assignedMachine || "",
        shift: data.shift || "Morning",
        joiningDate: data.joiningDate
          ? data.joiningDate.split("T")[0]
          : "",
        status: data.status || "Active"
      });
    } catch (error) {
      console.error("Fetch operator error:", error);
      alert("Failed to load operator details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (operatorId) {
      fetchOperator();
    }
  }, [operatorId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Update operator
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(
        `https://powerloom-management.onrender.com/api/operators/${operatorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update operator"
        );
      }

      alert("Operator updated successfully");

      setPage("operators");
    } catch (error) {
      console.error("Update operator error:", error);
      alert("Failed to update operator");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Edit Operator</h1>
        <p>Loading operator details...</p>
      </div>
    );
  }

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Edit Operator</h1>
          <p>Update operator information</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPage("operators")}
        >
          <ArrowLeft size={16} />
          Back to Operators
        </button>
      </div>

      {/* Form */}
      <div className="content-card">
        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Operator ID */}
            <div className="form-group">
              <label>Operator ID</label>

              <input
                type="text"
                name="operatorId"
                value={formData.operatorId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Operator Name */}
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

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Assigned Machine */}
            <div className="form-group">
              <label>Assigned Machine</label>

              <input
                type="text"
                name="assignedMachine"
                value={formData.assignedMachine}
                onChange={handleChange}
              />
            </div>

            {/* Shift */}
            <div className="form-group">
              <label>Shift</label>

              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>

            {/* Joining Date */}
            <div className="form-group">
              <label>Joining Date</label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "25px"
            }}
          >
            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              <Save size={16} />

              {saving ? "Saving..." : "Update Operator"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setPage("operators")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditOperator;