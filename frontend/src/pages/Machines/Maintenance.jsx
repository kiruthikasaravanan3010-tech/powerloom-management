import { useEffect, useState } from "react";
import { RefreshCw, Pencil, Trash2 } from "lucide-react";

function Maintenance({ setPage, setSelectedMaintenanceId }) {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/maintenance"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch maintenance");
      }

      setRecords(data);
    } catch (error) {
      console.error("Maintenance fetch error:", error);
      alert("Unable to load maintenance records");
    } finally {
      setLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/machines"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch machines");
      }

      setMachines(data);
    } catch (error) {
      console.error("Machine fetch error:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchMachines();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleMachineChange = (e) => {
    const machineId = e.target.value;

    const machine = machines.find(
      (item) => item.machineId === machineId
    );

    setForm({
      ...form,
      machineId: machineId,
      machineName: machine ? machine.machineName : ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/maintenance",
        {
          method: "POST",
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
          data.message || "Failed to add maintenance"
        );
      }

      alert("Maintenance added successfully");

      setForm({
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

      fetchRecords();
    } catch (error) {
      console.error("Add maintenance error:", error);
      alert(error.message);
    }
  };

  const handleEdit = (id) => {
    if (setSelectedMaintenanceId) {
      setSelectedMaintenanceId(id);
    }

    if (setPage) {
      setPage("edit-maintenance");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/maintenance/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete maintenance"
        );
      }

      alert("Maintenance deleted successfully");

      fetchRecords();
    } catch (error) {
      console.error("Delete maintenance error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Maintenance</h1>
          <p>Manage machine maintenance records</p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchRecords}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* ADD MAINTENANCE */}

      <div className="content-card">
        <h3>Add Maintenance</h3>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Maintenance ID</label>

              <input
                type="text"
                name="maintenanceId"
                value={form.maintenanceId}
                onChange={handleChange}
                placeholder="MNT001"
                required
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
                    {machine.machineId} - {machine.machineName}
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
                placeholder="Enter machine issue"
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
                placeholder="Technician name"
              />
            </div>

            <div className="form-group">
              <label>Cost</label>

              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="0"
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
                placeholder="Optional"
              />
            </div>

          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Add Maintenance
          </button>

        </form>
      </div>

      {/* MAINTENANCE TABLE */}

      <div className="content-card">

        <div className="card-header">
          <h3>Maintenance Records</h3>
        </div>

        {loading ? (
          <p>Loading maintenance records...</p>
        ) : records.length === 0 ? (
          <p>No maintenance records found.</p>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Machine</th>
                <th>Date</th>
                <th>Issue</th>
                <th>Technician</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {records.map((item) => (
                <tr key={item._id}>

                  <td>{item.maintenanceId}</td>

                  <td>
                    {item.machineId} - {item.machineName}
                  </td>

                  <td>
                    {item.maintenanceDate
                      ? new Date(
                          item.maintenanceDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{item.issue}</td>

                  <td>
                    {item.technician || "-"}
                  </td>

                  <td>
                    ₹{item.cost || 0}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        item.status === "Completed"
                          ? "approved"
                          : item.status === "In Progress"
                          ? "production"
                          : "pending"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        handleEdit(item.maintenanceId)
                      }
                      title="Edit"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        handleDelete(item.maintenanceId)
                      }
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default Maintenance;