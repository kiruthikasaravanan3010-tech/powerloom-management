import { useEffect, useState } from "react";

function AddPayment({ setPage, selectedOrderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "Cash",
    paymentDate: new Date().toISOString().split("T")[0],
    remarks: ""
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${selectedOrderId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order"
          );
        }

        setOrder(data);
      } catch (error) {
        console.error("Fetch order error:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedOrderId) {
      fetchOrder();
    }
  }, [selectedOrderId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (
      order &&
      Number(formData.amount) >
        Number(order.balanceAmount || 0)
    ) {
      alert(
        `Payment cannot be greater than balance ₹${Number(
          order.balanceAmount || 0
        ).toLocaleString("en-IN")}`
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            orderId: selectedOrderId,
            amount: Number(formData.amount),
            paymentMethod: formData.paymentMethod,
            paymentDate: formData.paymentDate,
            remarks: formData.remarks
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add payment"
        );
      }

      alert("Payment added successfully!");

      setPage("orders");
    } catch (error) {
      console.error("Add payment error:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading order...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <h2>Order not found</h2>

        <button
          className="secondary-btn"
          onClick={() => setPage("orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Add Payment</h1>
          <p>
            Add a new payment for order{" "}
            <strong>{order.orderId}</strong>
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPage("orders")}
        >
          Back to Orders
        </button>
      </div>

      <div className="content-card">

        <h2>Payment Summary</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "20px",
            margin: "20px 0"
          }}
        >
          <div>
            <p>Total Amount</p>
            <h3>
              ₹
              {Number(
                order.totalAmount || 0
              ).toLocaleString("en-IN")}
            </h3>
          </div>

          <div>
            <p>Total Paid</p>
            <h3>
              ₹
              {Number(
                order.advanceAmount || 0
              ).toLocaleString("en-IN")}
            </h3>
          </div>

          <div>
            <p>Balance</p>
            <h3>
              ₹
              {Number(
                order.balanceAmount || 0
              ).toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Payment Amount</label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter payment amount"
              min="1"
              max={order.balanceAmount}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">
                Bank Transfer
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Date</label>

            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Remarks</label>

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Optional remarks"
              rows="3"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px"
            }}
          >
            <button
              type="submit"
              className="primary-btn"
            >
              Add Payment
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setPage("orders")}
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddPayment;