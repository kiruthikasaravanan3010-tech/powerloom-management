import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

function DailyReport() {
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://powerloom-management.onrender.com/api/reports/daily"
      );

      const data = await response.json();

      setDailyData(data);
    } catch (error) {
      console.error("Error fetching daily report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const entries = Object.entries(dailyData);

  const totalProduction = entries.reduce(
    (total, [, quantity]) => total + quantity,
    0
  );

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Daily Production Report</h1>
          <p>Production summary by date</p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchDailyReport}
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
                <span>Total Days</span>
                <h2>{entries.length}</h2>
              </div>
            </div>

          </div>

          <div className="content-card">

            <h2>Daily Production</h2>

            {entries.length === 0 ? (
              <p>No production records available.</p>
            ) : (
              <table className="table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Production</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map(([date, quantity]) => (
                    <tr key={date}>
                      <td>{formatDate(date)}</td>
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

export default DailyReport;