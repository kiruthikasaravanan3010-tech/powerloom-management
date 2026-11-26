import { useState } from "react";

function AddMachine() {
  const [formData, setFormData] = useState({
    machineId: "",
    machineName: "",
    operatorName: "",
    production: "",
    status: "Running"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://powerloom-management.onrender.com/api/machines",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            production: Number(formData.production)
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Machine added successfully!");

        setFormData({
          machineId: "",
          machineName: "",
          operatorName: "",
          production: "",
          status: "Running"
        });
      } else {
        alert(data.error || data.message || "Failed to add machine");
      }

    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Add Machine</h1>
          <p>Add a new powerloom machine</p>
        </div>
      </div>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Machine ID</label>

              <input
                type="text"
                name="machineId"
                placeholder="Example: M-06"
                value={formData.machineId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Machine Name</label>

              <input
                type="text"
                name="machineName"
                placeholder="Example: Powerloom Machine 06"
                value={formData.machineName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Operator Name</label>

              <input
                type="text"
                name="operatorName"
                placeholder="Enter operator name"
                value={formData.operatorName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Current Production (pieces)</label>

              <input
                type="number"
                name="production"
                min="0"
                placeholder="Enter production"
                value={formData.production}
                onChange={handleChange}
              />
            </div>

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

          <button
            type="submit"
            className="primary-btn"
          >
            Save Machine
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddMachine;