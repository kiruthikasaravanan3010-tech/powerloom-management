import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

function EditMachine({ machineId, setPage }) {
  const [formData, setFormData] = useState({
    machineId: "",
    machineName: "",
    operatorName: "",
    production: "",
    status: "Stopped"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch machine details
  const fetchMachine = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/machines/${machineId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch machine");
      }

      const data = await response.json();

      setFormData({
        machineId: data.machineId || "",
        machineName: data.machineName || "",
        operatorName: data.operatorName || "",
        production: data.production || 0,
        status: data.status || "Stopped"
      });
    } catch (error) {
      console.error("Fetch machine error:", error);
      alert("Failed to load machine details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (machineId) {
      fetchMachine();
    }
  }, [machineId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Update machine
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/machines/${machineId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            machineId: formData.machineId,
            machineName: formData.machineName,
            operatorName: formData.operatorName,
            production: Number(formData.production),
            status: formData.status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update machine");
      }

      alert("Machine updated successfully");

      setPage("machines");
    } catch (error) {
      console.error("Update machine error:", error);
      alert("Failed to update machine");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Edit Machine</h1>
        <p>Loading machine details...</p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Edit Machine</h1>
          <p>Update machine information</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPage("machines")}
        >
          <ArrowLeft size={16} />
          Back to Machines
        </button>
      </div>

      {/* Form */}
      <div className="content-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Machine ID */}
            <div className="form-group">
              <label>Machine ID</label>

              <input
                type="text"
                name="machineId"
                value={formData.machineId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Machine Name */}
            <div className="form-group">
              <label>Machine Name</label>

              <input
                type="text"
                name="machineName"
                value={formData.machineName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Operator */}
            <div className="form-group">
              <label>Operator Name</label>

              <input
                type="text"
                name="operatorName"
                value={formData.operatorName}
                onChange={handleChange}
              />
            </div>

            {/* Production */}
            <div className="form-group">
              <label>Production</label>

              <input
                type="number"
                name="production"
                value={formData.production}
                onChange={handleChange}
                min="0"
                required
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
                <option value="Running">Running</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Stopped">Stopped</option>
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

              {saving ? "Saving..." : "Update Machine"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setPage("machines")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMachine;