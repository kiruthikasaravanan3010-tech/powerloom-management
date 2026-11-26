import { useEffect, useState } from "react";
import { RefreshCw, Pencil, Trash2 } from "lucide-react";

function ProductionHistory({ setPage, setSelectedProductionId }) {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://powerloom-management.onrender.com/api/production"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch production");
      }

      const data = await response.json();
      setProductions(data);
    } catch (error) {
      console.error("Error fetching production:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  // Edit Production
  const handleEdit = (id) => {
    setSelectedProductionId(id);
    setPage("edit-production");
  };

  // Delete Production
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this production record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://powerloom-management.onrender.com/api/production/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete production"
        );
      }

      alert("Production deleted successfully");

      fetchProductions();
    } catch (error) {
      console.error("Delete production error:", error);
      alert("Failed to delete production");
    }
  };

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">

        <div>
          <h1>Production History</h1>
          <p>View and manage production records</p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchProductions}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Table */}
      <div className="content-card">

        {loading ? (
          <p>Loading production records...</p>
        ) : productions.length === 0 ? (
          <p>No production records found.</p>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Machine</th>
                <th>Operator</th>
                <th>Cloth Type</th>
                <th>Quantity</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {productions.map((production) => (
                <tr key={production._id}>

                  <td>
                    {production.date
                      ? new Date(
                          production.date
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{production.shift}</td>

                  <td>{production.machineNumber}</td>

                  <td>{production.operatorName}</td>

                  <td>{production.clothType}</td>

                  <td>{production.productionQuantity}pieces</td>

                  <td>
                    {production.remarks || "-"}
                  </td>

                  <td>

                    {/* Edit */}
                    <button
                      className="icon-btn"
                      title="Edit Production"
                      onClick={() =>
                        handleEdit(production._id)
                      }
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      className="icon-btn"
                      title="Delete Production"
                      onClick={() =>
                        handleDelete(production._id)
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

export default ProductionHistory;