import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

function OperatorPerformance() {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://powerloom-management.onrender.com/api/production"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch production");
      }

      const productions = await response.json();

      const operatorData = {};

      productions.forEach((item) => {
        const operator = item.operatorName || "Unknown";

        if (!operatorData[operator]) {
          operatorData[operator] = {
            operatorName: operator,
            totalProduction: 0,
            entries: 0
          };
        }

        operatorData[operator].totalProduction +=
          Number(item.productionQuantity) || 0;

        operatorData[operator].entries += 1;
      });

      const result = Object.values(operatorData).map((item) => ({
        ...item,
        averageProduction:
          item.entries > 0
            ? (
                item.totalProduction / item.entries
              ).toFixed(2)
            : 0
      }));

      setPerformance(result);
    } catch (error) {
      console.error("Operator performance error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const totalProduction = performance.reduce(
    (total, item) => total + item.totalProduction,
    0
  );

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>Operator Performance</h1>
          <p>
            View operator-wise production performance
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchPerformance}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Operators</span>
          <h2>{performance.length}</h2>
        </div>

        <div className="stat-card">
          <span>Total Production</span>
          <h2>{totalProduction}</h2>
        </div>

        <div className="stat-card">
          <span>Production Entries</span>
          <h2>
            {performance.reduce(
              (total, item) => total + item.entries,
              0
            )}
          </h2>
        </div>

      </div>


      <div className="content-card">

        <h2>Operator Performance</h2>

        {loading ? (

          <p>Loading performance...</p>

        ) : performance.length === 0 ? (

          <p style={{ color: "#6b7280" }}>
            No production data available.
          </p>

        ) : (

          <table className="table">

            <thead>
              <tr>
                <th>Operator</th>
                <th>Total Production</th>
                <th>Entries</th>
                <th>Average Production</th>
              </tr>
            </thead>

            <tbody>

              {performance.map((item) => (

                <tr key={item.operatorName}>

                  <td>
                    <strong>{item.operatorName}</strong>
                  </td>

                  <td>
                    {item.totalProduction}
                  </td>

                  <td>
                    {item.entries}
                  </td>

                  <td>
                    {item.averageProduction}
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

export default OperatorPerformance;