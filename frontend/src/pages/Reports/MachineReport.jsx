import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

function MachineReport() {
  const [machineData, setMachineData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMachineReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reports/machine"
      );

      const data = await response.json();

      setMachineData(data);
    } catch (error) {
      console.error("Error fetching machine report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineReport();
  }, []);

  const entries = Object.entries(machineData);

  const totalProduction = entries.reduce(
    (total, [, quantity]) => total + quantity,
    0
  );

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>Machine Production Report</h1>
          <p>Production summary for each powerloom machine</p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchMachineReport}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {loading ? (
        <p>Loading report...</p>
      ) : (
        <>
          <div className="stats-grid">

            <div className="stat-card">
              <div>
                <span>Total Production</span>
                <h2>{totalProduction} pieces</h2>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <span>Total Machines</span>
                <h2>{entries.length}</h2>
              </div>
            </div>

          </div>

          <div className="content-card">

            <h2>Machine-wise Production</h2>

            {entries.length === 0 ? (
              <p>No production records available.</p>
            ) : (
              <table className="table">

                <thead>
                  <tr>
                    <th>Machine Number</th>
                    <th>Total Production</th>
                  </tr>
                </thead>

                <tbody>

                  {entries.map(([machine, quantity]) => (
                    <tr key={machine}>

                      <td>
                        <strong>{machine}</strong>
                      </td>

                      <td>{quantity} pieces</td>

                    </tr>
                  ))}

                </tbody>

              </table>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default MachineReport;