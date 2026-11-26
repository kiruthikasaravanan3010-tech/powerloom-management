import { useEffect, useState } from "react";

function EditMaintenance({
  maintenanceId,
  setPage
}) {
  const [form, setForm] = useState({
    maintenanceId: "",
    machineId: "",
    machineName: "",
    maintenanceDate: "",
    issue: "",
    technician: "",
    cost: "",
    status: "Scheduled",
    remarks: ""
  });

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenance();
    fetchMachines();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await fetch(
        `https://powerloom-management.onrender.com/api/maintenance/${maintenanceId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch maintenance record"
        );
      }

      const data = await response.json();

      setForm({
        maintenanceId: data.maintenanceId || "",
        machineId: data.machineId || "",
        machineName: data.machineName || "",
        maintenanceDate: data.maintenanceDate
          ? data.maintenanceDate.substring(0, 10)
          : "",
        issue: data.issue || "",
        technician: data.technician || "",
        cost: data.cost || "",
        status: data.status || "Scheduled",
        remarks: data.remarks || ""
      });
    } catch (error) {
      console.error(
        "Error fetching maintenance:",
        error
      );
      alert("Failed to load maintenance record");
    } finally {
      setLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await fetch(
        "https://powerloom-management.onrender.com/api/machines"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch machines");
      }

      const data = await response.json();

      setMachines(data);
    } catch (error) {
      console.error(
        "Error fetching machines:",
        error
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleMachineChange = (e) => {
    const machineId = e.target.value;

    const selectedMachine = machines.find(
      (machine) => machine.machineId === machineId
    );

    setForm({
      ...form,
      machineId,
      machineName: selectedMachine
        ? selectedMachine.machineName
        : ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://powerloom-management.onrender.com/api/maintenance/${maintenanceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...form,
            cost: Number(form.cost) || 0
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update maintenance"
        );
      }

      alert("Maintenance updated successfully");

      setPage("maintenance");
    } catch (error) {
      console.error(
        "Update maintenance error:",
        error
      );

      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading maintenance record...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Edit Maintenance</h1>
          <p>Update maintenance record</p>
        </div>
      </div>

      <div className="content-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Maintenance ID</label>

              <input
                type="text"
                value={form.maintenanceId}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Machine</label>

              <select
                name="machineId"
                value={form.machineId}
                onChange={handleMachineChange}
                required
              >
                <option value="">
                  Select Machine
                </option>

                {machines.map((machine) => (
                  <option
                    key={machine._id}
                    value={machine.machineId}
                  >
                    {machine.machineId} -{" "}
                    {machine.machineName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Maintenance Date</label>

              <input
                type="date"
                name="maintenanceDate"
                value={form.maintenanceDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Issue</label>

              <input
                type="text"
                name="issue"
                value={form.issue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Technician</label>

              <input
                type="text"
                name="technician"
                value={form.technician}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Cost</label>

              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Remarks</label>

              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
              />
            </div>

          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              className="primary-btn"
            >
              Update Maintenance
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setPage("maintenance")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMaintenance;