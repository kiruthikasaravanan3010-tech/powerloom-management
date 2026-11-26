import { useEffect, useState } from "react";
import { RefreshCw, Plus, Pencil, Trash2 } from "lucide-react";

function CustomerList({ setPage, setSelectedCustomerId }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/customers"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Edit Customer
  const handleEdit = (customerId) => {
    setSelectedCustomerId(customerId);
    setPage("edit-customer");
  };

  // Delete Customer
  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete customer ${customerId}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete customer"
        );
      }

      alert("Customer deleted successfully");

      fetchCustomers();
    } catch (error) {
      console.error("Delete customer error:", error);
      alert("Failed to delete customer");
    }
  };

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>View and manage customers</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="secondary-btn"
            onClick={fetchCustomers}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="primary-btn"
            onClick={() => setPage("add-customer")}
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="content-card">

        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Total Orders</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>

                  <td>{customer.customerId}</td>

                  <td>{customer.customerName}</td>

                  <td>{customer.location}</td>

                  <td>
                    {customer.phoneNumber || "-"}
                  </td>

                  <td>{customer.totalOrders}</td>

                  <td>
                    <span
                      className={`status ${
                        customer.status.toLowerCase()
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td>

                    {/* Edit */}
                    <button
                      className="icon-btn"
                      title="Edit Customer"
                      onClick={() =>
                        handleEdit(customer.customerId)
                      }
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      className="icon-btn"
                      title="Delete Customer"
                      onClick={() =>
                        handleDelete(customer.customerId)
                      }
                    >
                      <Trash2 size={17} />
                    </button>

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

export default CustomerList;