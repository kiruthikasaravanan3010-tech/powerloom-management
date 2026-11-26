import { useEffect, useState } from "react";

import {
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Truck,
  History,
  X
} from "lucide-react";

function Orders({ setPage, setSelectedOrderId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment History
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] =
    useState(false);
  const [selectedPaymentOrder, setSelectedPaymentOrder] =
    useState(null);
  const [paymentLoading, setPaymentLoading] =
    useState(false);

  // ===============================
  // FETCH ORDERS
  // ===============================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FETCH PAYMENT HISTORY
  // ===============================

  const handlePaymentHistory = async (order) => {
    try {
      setPaymentLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/payments/${order.orderId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch payment history"
        );
      }

      setPaymentHistory(data);
      setSelectedPaymentOrder(order);
      setShowPaymentHistory(true);
    } catch (error) {
      console.error(
        "Payment history error:",
        error
      );

      alert(error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // WHATSAPP PAYMENT REMINDER
  // ===============================

  const handleWhatsAppReminder = (order) => {
    if (!order.phoneNumber) {
      alert("Customer phone number not found.");
      return;
    }

    const phoneNumber =
      order.phoneNumber.replace(/\D/g, "");

    const message = `Hello ${order.customerName},

This is a payment reminder from Kiruthika Textiles.

Cloth: ${order.clothType}
Quantity: ${order.quantity} pieces
Total Amount: ₹${Number(
      order.totalAmount || 0
    ).toLocaleString("en-IN")}
Paid Amount: ₹${Number(
      order.advanceAmount || 0
    ).toLocaleString("en-IN")}
Balance Amount: ₹${Number(
      order.balanceAmount || 0
    ).toLocaleString("en-IN")}
Due Date: ${
      order.dueDate
        ? new Date(
            order.dueDate
          ).toLocaleDateString("en-IN")
        : "Not specified"
    }

Kindly make the pending payment.

Thank you,
Kiruthika Textiles`;

    const whatsappUrl =
      `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  };

  // ===============================
  // EDIT ORDER
  // ===============================

  const handleEdit = (orderId) => {
    setSelectedOrderId(orderId);
    setPage("edit-order");
  };

  // ===============================
  // DELETE ORDER
  // ===============================

  const handleDelete = async (orderId) => {
    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete order ${orderId}?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete order"
        );
      }

      alert(
        "Order deleted successfully"
      );

      fetchOrders();
    } catch (error) {
      console.error(
        "Delete order error:",
        error
      );

      alert(error.message);
    }
  };

  // ===============================
  // DISPATCH ORDER
  // ===============================

  const handleDispatch = async (order) => {
    const confirmDispatch =
      window.confirm(
        `Are you sure you want to dispatch order ${order.orderId}?`
      );

    if (!confirmDispatch) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order.orderId}/dispatch`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to dispatch order"
        );
      }

      alert(
        "Order dispatched successfully!\nStock updated."
      );

      fetchOrders();
    } catch (error) {
      console.error(
        "Dispatch order error:",
        error
      );

      alert(error.message);
    }
  };

  // ===============================
  // CLOSE PAYMENT HISTORY
  // ===============================

  const closePaymentHistory = () => {
    setShowPaymentHistory(false);
    setSelectedPaymentOrder(null);
    setPaymentHistory([]);
  };

  return (
    <div className="page">

      {/* ===============================
          PAGE HEADER
      =============================== */}

      <div className="page-header">

        <div>
          <h1>Orders</h1>

          <p>
            View and manage customer orders
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          {/* Refresh */}

          <button
            className="secondary-btn"
            onClick={fetchOrders}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {/* Add Order */}

          <button
            className="primary-btn"
            onClick={() =>
              setPage("add-order")
            }
          >
            <Plus size={16} />
            Add Order
          </button>

        </div>

      </div>

      {/* ===============================
          ORDERS TABLE
      =============================== */}

      <div className="content-card">

        {loading ? (

          <p>
            Loading orders...
          </p>

        ) : orders.length === 0 ? (

          <p>
            No orders found.
          </p>

        ) : (

          <div className="orders-table-wrapper">

            <table className="table orders-table">

              <thead>
                <tr>

                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Cloth Type</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>

                  <th>Total Amount</th>
                  <th>Advance / Paid</th>
                  <th>Balance</th>
                  <th>Payment Method</th>
                  <th>Due Date</th>
                  <th>Payment Status</th>

                  <th>Status</th>

                  <th className="action-column">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    {/* Order ID */}

                    <td>
                      {order.orderId}
                    </td>

                    {/* Customer */}

                    <td>
                      {order.customerName}
                    </td>

                    {/* Location */}

                    <td>
                      {order.location}
                    </td>

                    {/* Cloth */}

                    <td>
                      {order.clothType}
                    </td>

                    {/* Quantity */}

                    <td>
                      {order.quantity} pieces
                    </td>

                    {/* Order Date */}

                    <td>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Delivery Date */}

                    <td>
                      {order.deliveryDate
                        ? new Date(
                            order.deliveryDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Total Amount */}

                    <td>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Paid */}

                    <td>
                      ₹
                      {Number(
                        order.advanceAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Balance */}

                    <td>
                      ₹
                      {Number(
                        order.balanceAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Payment Method */}

                    <td>
                      {order.paymentMethod || "-"}
                    </td>

                    {/* Due Date */}

                    <td>
                      {order.dueDate
                        ? new Date(
                            order.dueDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Payment Status */}

                    <td>
                      <span
                        className={`status ${
                          order.paymentStatus
                            ? order.paymentStatus
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )
                            : "pending"
                        }`}
                      >
                        {order.paymentStatus ||
                          "Pending"}
                      </span>
                    </td>

                    {/* Order Status */}

                    <td>
                      <span
                        className={`status ${
                          order.status
                            .toLowerCase()
                            .replace(
                              " ",
                              "-"
                            )
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* ===============================
                        ACTIONS
                    =============================== */}

                    <td className="action-column">

                      <div className="order-actions">

                        {/* ROW 1 */}

                        <div className="order-action-row">

                          {/* Edit */}

                          {order.status !==
                            "Dispatched" && (

                            <button
                              className="order-action-btn"
                              title="Edit Order"
                              onClick={() =>
                                handleEdit(
                                  order.orderId
                                )
                              }
                            >
                              <Pencil size={15} />
                            </button>

                          )}

                          {/* Delete */}

                          <button
                            className="order-action-btn delete-action"
                            title="Delete Order"
                            onClick={() =>
                              handleDelete(
                                order.orderId
                              )
                            }
                          >
                            <Trash2 size={15} />
                          </button>

                          {/* Dispatch */}

                          {order.status !==
                            "Dispatched" && (

                            <button
                              className="order-action-btn"
                              title="Dispatch Order"
                              onClick={() =>
                                handleDispatch(
                                  order
                                )
                              }
                            >
                              <Truck size={15} />
                            </button>

                          )}

                        </div>

                        {/* ROW 2 */}

                        <div className="order-action-row">

                          {/* Add Payment */}

                          <button
                            className="order-action-btn payment-action"
                            title="Add Payment"
                            onClick={() => {
                              setSelectedOrderId(
                                order.orderId
                              );

                              setPage(
                                "add-payment"
                              );
                            }}
                          >
                            <Plus size={15} />
                          </button>

                          {/* WhatsApp */}

                          <button
                            className="order-action-btn whatsapp-action"
                            title="WhatsApp Payment Reminder"
                            onClick={() =>
                              handleWhatsAppReminder(
                                order
                              )
                            }
                          >
                            💬
                          </button>

                          {/* Payment History */}

                          <button
                            className="order-action-btn"
                            title="Payment History"
                            onClick={() =>
                              handlePaymentHistory(
                                order
                              )
                            }
                          >
                            <History size={15} />
                          </button>

                        </div>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =================================================
          PAYMENT HISTORY MODAL
      ================================================= */}

      {showPaymentHistory &&
        selectedPaymentOrder && (

        <div className="modal-overlay">

          <div className="modal-card">

            {/* Modal Header */}

            <div className="modal-header">

              <div>

                <h2>
                  Payment History
                </h2>

                <p>
                  Order:{" "}
                  <strong>
                    {selectedPaymentOrder.orderId}
                  </strong>
                </p>

              </div>

              <button
                className="icon-btn"
                title="Close"
                onClick={
                  closePaymentHistory
                }
              >
                <X size={20} />
              </button>

            </div>

            {/* Payment Summary */}

            <div className="payment-summary">

              <div>

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedPaymentOrder.totalAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Total Paid
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedPaymentOrder.advanceAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Balance
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedPaymentOrder.balanceAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

            {/* Payment History Table */}

            {paymentLoading ? (

              <p>
                Loading payment history...
              </p>

            ) : paymentHistory.length === 0 ? (

              <p>
                No payment history found.
              </p>

            ) : (

              <table className="table">

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Method
                    </th>

                    <th>
                      Remarks
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paymentHistory.map(
                    (payment) => (

                    <tr
                      key={
                        payment._id
                      }
                    >

                      <td>
                        {payment.paymentDate
                          ? new Date(
                              payment.paymentDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          payment.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        {payment.paymentMethod}
                      </td>

                      <td>
                        {payment.remarks ||
                          "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Orders;