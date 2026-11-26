import { useEffect, useState } from "react";
import { Eye, RefreshCw, Plus, Pencil, Trash2 } from "lucide-react";

function MachineList({ setPage, setSelectedMachineId }) {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMachines = async () => {
    try {
      setLoading(true);

      const response = await fetch("https://powerloom-management.onrender.com/api/machines");

      if (!response.ok) {
        throw new Error("Failed to fetch machines");
      }

      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // View Details
  const handleViewDetails = (machineId) => {
    setSelectedMachineId(machineId);
    setPage("machine-details");
  };

  // Edit Machine
  const handleEdit = (machineId) => {
    setSelectedMachineId(machineId);
    setPage("edit-machine");
  };

  // Delete Machine
  const handleDelete = async (machineId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete machine ${machineId}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://powerloom-management.onrender.com/api/machines/${machineId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete machine");
      }

      alert("Machine deleted successfully");

      fetchMachines();
    } catch (error) {
      console.error("Delete machine error:", error);
      alert("Failed to delete machine");
    }
  };

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Machines</h1>
          <p>View and manage powerloom machines</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="secondary-btn" onClick={fetchMachines}>
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="primary-btn"
            onClick={() => setPage("add-machine")}
          >
            <Plus size={16} />
            Add Machine
          </button>
        </div>
      </div>

      {/* Machine Table */}
      <div className="content-card">
        {loading ? (
          <p>Loading machines...</p>
        ) : machines.length === 0 ? (
          <p>No machines found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Machine ID</th>
                <th>Machine Name</th>
                <th>Operator</th>
                <th>Production</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {machines.map((machine) => (
                <tr key={machine._id}>
                  <td>{machine.machineId}</td>

                  <td>{machine.machineName}</td>

                  <td>
                    {machine.operatorName || "Not Assigned"}
                  </td>

                  <td>{machine.production}</td>

                  <td>
                    <span
                      className={`status ${machine.status.toLowerCase()}`}
                    >
                      {machine.status}
                    </span>
                  </td>

                  <td>
                    {/* View */}
                    <button
                      className="icon-btn"
                      title="View Details"
                      onClick={() =>
                        handleViewDetails(machine.machineId)
                      }
                    >
                      <Eye size={17} />
                    </button>

                    {/* Edit */}
                    <button
                      className="icon-btn"
                      title="Edit Machine"
                      onClick={() =>
                        handleEdit(machine.machineId)
                      }
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      className="icon-btn"
                      title="Delete Machine"
                      onClick={() =>
                        handleDelete(machine.machineId)
                      }
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

export default MachineList;