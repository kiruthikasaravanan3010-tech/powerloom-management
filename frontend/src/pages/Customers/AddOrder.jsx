import { useState } from "react";

function AddOrder() {
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    location: "",
    clothType: "",
    quantity: "",
    orderDate: "",
    deliveryDate: "",

    // Payment Details
    totalAmount: "",
    paymentMethod: "",
    advanceAmount: "",
    creditDays: "0",

    status: "Pending"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate balance amount
  const balanceAmount =
    Number(formData.totalAmount || 0) -
    Number(formData.advanceAmount || 0);

  // Calculate payment status
  const getPaymentStatus = () => {
    const total = Number(formData.totalAmount || 0);
    const advance = Number(formData.advanceAmount || 0);

    if (total <= 0) {
      return "Pending";
    }

    if (advance <= 0) {
      return "Pending";
    }

    if (advance >= total) {
      return "Paid";
    }

    return "Partial";
  };

  // Calculate due date
  const getDueDate = () => {
    if (
      !formData.orderDate ||
      Number(formData.creditDays) <= 0 ||
      balanceAmount <= 0
    ) {
      return null;
    }

    const date = new Date(formData.orderDate);

    date.setDate(
      date.getDate() +
        Number(formData.creditDays)
    );

    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount =
      Number(formData.totalAmount);

    const advanceAmount =
      Number(formData.advanceAmount || 0);

    const calculatedBalance =
      totalAmount - advanceAmount;

    // Basic validation
    if (advanceAmount > totalAmount) {
      alert(
        "Advance amount cannot be greater than total amount"
      );
      return;
    }

    if (totalAmount <= 0) {
      alert(
        "Total amount must be greater than 0"
      );
      return;
    }

    if (!formData.paymentMethod) {
      alert("Please select payment method");
      return;
    }

    const paymentStatus =
      getPaymentStatus();

    const dueDate =
      getDueDate();

    try {
      const response = await fetch(
        "https://powerloom-management.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            orderId: formData.orderId,
            customerName: formData.customerName,
            location: formData.location,
            clothType: formData.clothType,
            quantity: Number(formData.quantity),

            orderDate: formData.orderDate,
            deliveryDate:
              formData.deliveryDate,

            // Payment Details
            totalAmount: totalAmount,

            paymentMethod:
              formData.paymentMethod,

            advanceAmount:
              advanceAmount,

            balanceAmount:
              calculatedBalance,

            creditDays:
              Number(formData.creditDays || 0),

            dueDate: dueDate,

            paymentStatus:
              paymentStatus,

            status: formData.status
          })
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert(
          "Order added successfully!"
        );

        setFormData({
          orderId: "",
          customerName: "",
          location: "",
          clothType: "",
          quantity: "",
          orderDate: "",
          deliveryDate: "",

          totalAmount: "",
          paymentMethod: "",
          advanceAmount: "",
          creditDays: "0",

          status: "Pending"
        });
      } else {
        alert(
          data.error ||
          data.message ||
          "Failed to add order"
        );
      }
    } catch (error) {
      console.error(
        "Error:",
        error
      );

      alert(
        "Backend connection failed"
      );
    }
  };

  const dueDate = getDueDate();

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>Add Order</h1>

          <p>
            Create a new customer order
          </p>
        </div>

      </div>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          {/* ========================= */}
          {/* ORDER DETAILS */}
          {/* ========================= */}

          <h3
            style={{
              marginBottom: "20px"
            }}
          >
            Order Details
          </h3>

          <div className="form-grid">

            <div className="form-group">

              <label>Order ID</label>

              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="KT1005"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Customer Name
              </label>

              <input
                type="text"
                name="customerName"
                value={
                  formData.customerName
                }
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

              <label>Cloth Type</label>

              <select
                name="clothType"
                value={formData.clothType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Cloth Type
                </option>

                <option value="Kerala Vesti">
                  Kerala Vesti
                </option>

                <option value="Lungi">
                  Lungi
                </option>

                <option value="Jari Vesti">
                  Jari Vesti
                </option>

                <option value="Printed Vesti">
                  Printed Vesti
                </option>

                <option value="Kaavi Vari Vesti">
                  Kaavi Vari Vesti
                </option>

                <option value="Kuppadam">
                  Kuppadam
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Quantity (pieces)
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="500"
                min="1"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Order Date
              </label>

              <input
                type="date"
                name="orderDate"
                value={
                  formData.orderDate
                }
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Delivery Date
              </label>

              <input
                type="date"
                name="deliveryDate"
                value={
                  formData.deliveryDate
                }
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Production">
                  Production
                </option>

                <option value="Dispatched">
                  Dispatched
                </option>

              </select>

            </div>

          </div>

          {/* ========================= */}
          {/* PAYMENT DETAILS */}
          {/* ========================= */}

          <h3
            style={{
              marginTop: "35px",
              marginBottom: "20px"
            }}
          >
            Payment Details
          </h3>

          <div className="form-grid">

            {/* Total Amount */}

            <div className="form-group">

              <label>
                Total Amount (₹)
              </label>

              <input
                type="number"
                name="totalAmount"
                value={
                  formData.totalAmount
                }
                onChange={handleChange}
                placeholder="50000"
                min="1"
                required
              />

            </div>

            {/* Payment Method */}

            <div className="form-group">

              <label>
                Payment Method
              </label>

              <select
                name="paymentMethod"
                value={
                  formData.paymentMethod
                }
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Payment Method
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Cash on Delivery">
                  Cash on Delivery
                </option>

              </select>

            </div>

            {/* Advance */}

            <div className="form-group">

              <label>
                Advance Amount (₹)
              </label>

              <input
                type="number"
                name="advanceAmount"
                value={
                  formData.advanceAmount
                }
                onChange={handleChange}
                placeholder="20000"
                min="0"
              />

            </div>

            {/* Balance */}

            <div className="form-group">

              <label>
                Balance Amount (₹)
              </label>

              <input
                type="number"
                value={
                  balanceAmount >= 0
                    ? balanceAmount
                    : 0
                }
                readOnly
              />

            </div>

            {/* Credit Days */}

            <div className="form-group">

              <label>
                Payment Credit Period
              </label>

              <select
                name="creditDays"
                value={
                  formData.creditDays
                }
                onChange={handleChange}
              >

                <option value="0">
                  Immediate Payment
                </option>

                <option value="7">
                  7 Days
                </option>

                <option value="15">
                  15 Days
                </option>

                <option value="30">
                  30 Days
                </option>

                <option value="45">
                  45 Days
                </option>

                <option value="60">
                  60 Days
                </option>

              </select>

            </div>

            {/* Due Date */}

            <div className="form-group">

              <label>
                Payment Due Date
              </label>

              <input
                type="date"
                value={dueDate || ""}
                readOnly
              />

            </div>

            {/* Payment Status */}

            <div className="form-group">

              <label>
                Payment Status
              </label>

              <input
                type="text"
                value={getPaymentStatus()}
                readOnly
              />

            </div>

          </div>

          {/* ========================= */}
          {/* PAYMENT SUMMARY */}
          {/* ========================= */}

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "10px",
              background: "#f8fafc"
            }}
          >

            <strong>
              Payment Summary
            </strong>

            <p>
              Total: ₹
              {Number(
                formData.totalAmount || 0
              ).toLocaleString("en-IN")}
            </p>

            <p>
              Advance: ₹
              {Number(
                formData.advanceAmount || 0
              ).toLocaleString("en-IN")}
            </p>

            <p>
              Balance: ₹
              {Number(
                balanceAmount >= 0
                  ? balanceAmount
                  : 0
              ).toLocaleString("en-IN")}
            </p>

            <p>
              Status:{" "}
              <strong>
                {getPaymentStatus()}
              </strong>
            </p>

          </div>

          <button
            type="submit"
            className="primary-btn"
            style={{
              marginTop: "25px"
            }}
          >
            Add Order
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddOrder;