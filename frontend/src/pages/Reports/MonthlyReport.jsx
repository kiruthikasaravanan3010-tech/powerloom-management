import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMonthlyReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reports/monthly"
      );

      const data = await response.json();

      setMonthlyData(data);
    } catch (error) {
      console.error("Error fetching monthly report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, []);

  const entries = Object.entries(monthlyData);

  const totalProduction = entries.reduce(
    (total, [, quantity]) => total + quantity,
    0
  );

  const formatMonth = (month) => {
    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1
    );

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>Monthly Production Report</h1>
          <p>Production summary by month</p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchMonthlyReport}
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
                <span>Total Months</span>
                <h2>{entries.length}</h2>
              </div>
            </div>

          </div>

          <div className="content-card">

            <h2>Monthly Production</h2>

            {entries.length === 0 ? (
              <p>No production records available.</p>
            ) : (
              <table className="table">

                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Production</th>
                  </tr>
                </thead>

                <tbody>

                  {entries.map(([month, quantity]) => (
                    <tr key={month}>

                      <td>{formatMonth(month)}</td>

                      <td>
                        <strong>{quantity} pieces</strong>
                      </td>

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

export default MonthlyReport;