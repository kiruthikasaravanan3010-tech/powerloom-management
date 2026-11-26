import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";

function MachineDetails({ machineId, setPage }) {
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMachineDetails = async () => {
    if (!machineId) {
      setError("No machine selected");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/machines/${machineId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch machine details");
      }

      const data = await response.json();

      setMachine(data);
    } catch (error) {
      console.error("Machine details error:", error);
      setError("Failed to load machine details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineDetails();
  }, [machineId]);

  if (loading) {
    return (
      <div className="page">
        <h1>Machine Details</h1>
        <p>Loading machine details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Machine Details</h1>
            <p>{error}</p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("machines")}
          >
            <ArrowLeft size={16} />
            Back to Machines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Machine Details</h1>
          <p>View machine information and production details</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            className="secondary-btn"
            onClick={fetchMachineDetails}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="secondary-btn"
            onClick={() => setPage("machines")}
          >
            <ArrowLeft size={16} />
            Back to Machines
          </button>

        </div>
      </div>


      <div className="content-card">

        <h2>{machine.machineName}</h2>

        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Machine ID: {machine.machineId}
        </p>


        <div className="machine-info">

          <div>
            <span>Machine ID</span>
            <strong>{machine.machineId}</strong>
          </div>

          <div>
            <span>Machine Name</span>
            <strong>{machine.machineName}</strong>
          </div>

          <div>
            <span>Operator</span>
            <strong>
              {machine.operatorName || "Not Assigned"}
            </strong>
          </div>

          <div>
            <span>Production</span>
            <strong>{machine.production}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{machine.status}</strong>
          </div>

          <div>
            <span>Created On</span>
            <strong>
              {machine.createdAt
                ? new Date(machine.createdAt).toLocaleDateString()
                : "N/A"}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default MachineDetails;