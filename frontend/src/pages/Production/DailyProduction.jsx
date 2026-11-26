import { useEffect, useState } from "react";

function DailyProduction() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductions = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/production"
      );

      const data = await response.json();

      if (response.ok) {
        setProductions(data);
      } else {
        alert(data.message || "Failed to fetch production");
      }

    } catch (error) {
      console.error("Error fetching production:", error);
      alert("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>Daily Production</h1>
          <p>View daily machine production records</p>
        </div>

        <button
          className="primary-btn"
          onClick={fetchProductions}
        >
          Refresh
        </button>

      </div>

      <div className="content-card">

        {loading ? (
          <p>Loading production records...</p>
        ) : productions.length === 0 ? (
          <p>No production records found.</p>
        ) : (

          <table>

            <thead>
              <tr>
                <th>Date</th>
                <th>Machine</th>
                <th>Operator</th>
                <th>Cloth Type</th>
                <th>Shift</th>
                <th>Production</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>

              {productions.map((production) => (

                <tr key={production._id}>

                  <td>
                    {new Date(
                      production.date
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    {production.machineNumber}
                  </td>

                  <td>
                    {production.operatorName}
                  </td>

                  <td>
                    {production.clothType}
                  </td>

                  <td>
                    {production.shift}
                  </td>

                  <td>
                    <strong>
                      {production.productionQuantity} pieces
                    </strong>
                  </td>

                  <td>
                    {production.remarks || "-"}
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

export default DailyProduction;