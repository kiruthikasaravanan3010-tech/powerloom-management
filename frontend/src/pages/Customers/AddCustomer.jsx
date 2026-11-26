import { useState } from "react";

function AddCustomer() {
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    location: "",
    phoneNumber: "",
    status: "Active"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://powerloom-management.onrender.com/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Customer added successfully!");

        setFormData({
          customerId: "",
          customerName: "",
          location: "",
          phoneNumber: "",
          status: "Active"
        });
      } else {
        alert(data.error || "Failed to add customer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Backend connection failed");
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Add Customer</h1>
          <p>Add dealer or customer information</p>
        </div>
      </div>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Customer ID</label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="CUS-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Sri Lakshmi Textiles"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Erode"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

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

          <button type="submit" className="primary-btn">
            Add Customer
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddCustomer;