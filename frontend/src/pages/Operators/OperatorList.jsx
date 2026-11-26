import { useEffect, useState } from "react";
import { RefreshCw, Plus, Pencil, Trash2 } from "lucide-react";

function OperatorList({ setPage, setSelectedOperatorId }) {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOperators = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://powerloom-management.onrender.com/api/operators"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch operators");
      }

      const data = await response.json();
      setOperators(data);
    } catch (error) {
      console.error("Error fetching operators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  // Edit Operator
  const handleEdit = (operatorId) => {
    setSelectedOperatorId(operatorId);
    setPage("edit-operator");
  };

  // Delete Operator
  const handleDelete = async (operatorId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete operator ${operatorId}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://powerloom-management.onrender.com/api/operators/${operatorId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete operator"
        );
      }

      alert("Operator deleted successfully");

      fetchOperators();
    } catch (error) {
      console.error("Delete operator error:", error);
      alert("Failed to delete operator");
    }
  };

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Operators</h1>
          <p>View and manage powerloom operators</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="secondary-btn"
            onClick={fetchOperators}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="primary-btn"
            onClick={() => setPage("add-operator")}
          >
            <Plus size={16} />
            Add Operator
          </button>
        </div>
      </div>

      {/* Operator Table */}
      <div className="content-card">

        {loading ? (
          <p>Loading operators...</p>
        ) : operators.length === 0 ? (
          <p>No operators found.</p>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>Operator ID</th>
                <th>Operator Name</th>
                <th>Phone</th>
                <th>Machine</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {operators.map((operator) => (
                <tr key={operator._id}>

                  <td>{operator.operatorId}</td>

                  <td>
                    <div className="operator-name">
                      <div className="operator-icon">
                        {operator.operatorName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      {operator.operatorName}
                    </div>
                  </td>

                  <td>
                    {operator.phoneNumber || "-"}
                  </td>

                  <td>
                    {operator.assignedMachine || "Not Assigned"}
                  </td>

                  <td>{operator.shift}</td>

                  <td>
                    <span
                      className={`status ${
                        operator.status.toLowerCase()
                      }`}
                    >
                      {operator.status}
                    </span>
                  </td>

                  <td>

                    {/* Edit */}
                    <button
                      className="icon-btn"
                      title="Edit Operator"
                      onClick={() =>
                        handleEdit(operator.operatorId)
                      }
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      className="icon-btn"
                      title="Delete Operator"
                      onClick={() =>
                        handleDelete(operator.operatorId)
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

export default OperatorList;