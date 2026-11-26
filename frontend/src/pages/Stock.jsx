import { useEffect, useState } from "react";
import { RefreshCw, Package } from "lucide-react";

function Stock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/stock"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch stock"
        );
      }

      setStock(data);
    } catch (error) {
      console.error("Stock fetch error:", error);
      alert("Unable to load stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>Stock</h1>

          <p>
            View available fabric stock
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchStock}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      <div className="content-card">

        <div className="card-header">

          <div>
            <h3>Current Stock</h3>

            <p>
              Stock is updated automatically from production and dispatch.
            </p>
          </div>

        </div>

        {loading ? (
          <p>Loading stock...</p>
        ) : stock.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Package size={40} />
            <p>No stock available.</p>
          </div>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>Cloth Type</th>
                <th>Available Quantity</th>
                <th>Unit</th>
              </tr>
            </thead>

            <tbody>

              {stock.map((item) => (
                <tr key={item._id}>

                  <td>
                    <strong>
                      {item.clothType}
                    </strong>
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    Pieces
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

export default Stock;