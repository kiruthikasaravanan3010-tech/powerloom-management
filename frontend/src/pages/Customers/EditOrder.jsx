import { useEffect, useState } from "react";

function EditOrder({ orderId, setPage }) {
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    location: "",
    clothType: "",
    quantity: "",
    orderDate: "",
    deliveryDate: "",
    status: "Pending"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `https://powerloom-management.onrender.com/api/orders/${orderId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();

        setFormData({
          orderId: data.orderId || "",
          customerName: data.customerName || "",
          location: data.location || "",
          clothType: data.clothType || "",
          quantity: data.quantity || "",
          orderDate: data.orderDate
            ? data.orderDate.substring(0, 10)
            : "",
          deliveryDate: data.deliveryDate
            ? data.deliveryDate.substring(0, 10)
            : "",
          status: data.status || "Pending"
        });
      } catch (error) {
        console.error("Fetch order error:", error);
        alert("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.orderId ||
      !formData.customerName ||
      !formData.location ||
      !formData.clothType ||
      !formData.quantity ||
      !formData.orderDate ||
      !formData.deliveryDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `https://powerloom-management.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            quantity: Number(formData.quantity)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      alert("Order updated successfully");

      setPage("orders");
    } catch (error) {
      console.error("Update order error:", error);
      alert("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading order...</p>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Edit Order</h1>
          <p>Update customer order details</p>
        </div>
      </div>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Order ID */}
            <div className="form-group">
              <label>Order ID</label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Customer Name */}
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Cloth Type */}
            <div className="form-group">
              <label>Cloth Type</label>
              <input
                type="text"
                name="clothType"
                value={formData.clothType}
                onChange={handleChange}
                required
              />
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {/* Order Date */}
            <div className="form-group">
              <label>Order Date</label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Delivery Date */}
            <div className="form-group">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Production">Production</option>
                <option value="Dispatched">Dispatched</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
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
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Order"}
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

export default EditOrder;