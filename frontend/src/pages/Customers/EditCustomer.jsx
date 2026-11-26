import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

function EditCustomer({ customerId, setPage }) {
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    location: "",
    phoneNumber: "",
    totalOrders: 0,
    status: "Active"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch customer details
  const fetchCustomer = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customer");
      }

      const data = await response.json();

      setFormData({
        customerId: data.customerId || "",
        customerName: data.customerName || "",
        location: data.location || "",
        phoneNumber: data.phoneNumber || "",
        totalOrders: data.totalOrders || 0,
        status: data.status || "Active"
      });
    } catch (error) {
      console.error("Fetch customer error:", error);
      alert("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            customerId: formData.customerId,
            customerName: formData.customerName,
            location: formData.location,
            phoneNumber: formData.phoneNumber,
            totalOrders: Number(formData.totalOrders),
            status: formData.status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update customer"
        );
      }

      alert("Customer updated successfully");

      setPage("customers");
    } catch (error) {
      console.error("Update customer error:", error);
      alert("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Edit Customer</h1>
        <p>Loading customer details...</p>
      </div>
    );
  }

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Edit Customer</h1>
          <p>Update customer information</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPage("customers")}
        >
          <ArrowLeft size={16} />
          Back to Customers
        </button>
      </div>

      {/* Form */}
      <div className="content-card">
        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Customer ID */}
            <div className="form-group">
              <label>Customer ID</label>

              <input
                type="text"
                name="customerId"
                value={formData.customerId}
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

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Total Orders */}
            <div className="form-group">
              <label>Total Orders</label>

              <input
                type="number"
                name="totalOrders"
                value={formData.totalOrders}
                onChange={handleChange}
                min="0"
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "25px"
            }}
          >
            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              <Save size={16} />

              {saving ? "Saving..." : "Update Customer"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setPage("customers")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditCustomer;