import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  User,
  X,
  Package,
  CalendarDays,
} from "lucide-react";
import { formatDate } from "../utils/formatDate";

// =====================================
// NOTIFICATION SETTINGS
// =====================================

const getNotificationSettings = () => {
  const defaults = {
    newOrderAlerts: true,
    productionEntryAlerts: true,
    maintenanceAlerts: true,
    lowStockAlerts: true,
    pendingPaymentAlerts: true,
    lowStockLimit: 100,
  };

  try {
    const saved = localStorage.getItem("powerloomSettings");

    return saved
      ? { ...defaults, ...JSON.parse(saved) }
      : defaults;
  } catch (error) {
    console.error("Unable to load notification settings:", error);
    return defaults;
  }
};

// =====================================
// DATE HELPER
// =====================================

const getTodayStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

// =====================================
// HEADER COMPONENT
// =====================================

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [todayProduction, setTodayProduction] = useState(0);
  const [formattedDate, setFormattedDate] = useState(() =>
    formatDate(new Date())
  );

  // =====================================
  // UPDATE HEADER DATE
  // =====================================

  useEffect(() => {
    const updateDate = () => {
      setFormattedDate(formatDate(new Date()));
    };

    updateDate();

    const interval = setInterval(updateDate, 60 * 1000);

    // Update when the browser tab becomes active.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateDate();
      }
    };

    window.addEventListener("focus", updateDate);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", updateDate);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // =====================================
  // FETCH NOTIFICATIONS
  // =====================================

  const fetchNotifications = useCallback(async () => {
    try {
      const [
        ordersRes,
        maintenanceRes,
        productionRes,
        stockRes,
      ] = await Promise.all([
        fetch("http://localhost:5000/api/orders"),
        fetch("http://localhost:5000/api/maintenance"),
        fetch("http://localhost:5000/api/production/summary"),
        fetch("http://localhost:5000/api/stock"),
      ]);

      if (
        !ordersRes.ok ||
        !maintenanceRes.ok ||
        !productionRes.ok ||
        !stockRes.ok
      ) {
        throw new Error("Unable to fetch notification data.");
      }

      const [
        ordersData,
        maintenanceData,
        productionData,
        stockData,
      ] = await Promise.all([
        ordersRes.json(),
        maintenanceRes.json(),
        productionRes.json(),
        stockRes.json(),
      ]);

      setTodayProduction(
        Number(productionData.todayProduction || 0)
      );

      const notificationSettings = getNotificationSettings();
      const newNotifications = [];
      const todayStart = getTodayStart();
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      // =====================================
      // PRODUCTION ENTRY NOTIFICATIONS
      // =====================================

      if (notificationSettings.productionEntryAlerts) {
        try {
          const productionEntriesRes = await fetch(
            "http://localhost:5000/api/production"
          );

          if (productionEntriesRes.ok) {
            const productionEntriesData =
              await productionEntriesRes.json();

            if (Array.isArray(productionEntriesData)) {
              productionEntriesData.forEach((entry) => {
                if (!entry.createdAt) return;

                const createdAt = new Date(entry.createdAt);

                if (
                  !Number.isNaN(createdAt.getTime()) &&
                  createdAt >= todayStart &&
                  createdAt < todayEnd
                ) {
                  newNotifications.push({
                    id: `production-${entry._id}`,
                    type: "production",
                    title: "Production Entry Added",
                    message: `${
                      entry.clothType || "Cloth"
                    } - ${Number(
                      entry.productionQuantity || 0
                    ).toLocaleString("en-IN")} pieces`,
                  });
                }
              });
            }
          }
        } catch (error) {
          console.error(
            "Production entry notification error:",
            error
          );
        }
      }

      // =====================================
      // NEW ORDER NOTIFICATIONS
      // =====================================

      if (
        notificationSettings.newOrderAlerts &&
        Array.isArray(ordersData)
      ) {
        ordersData.forEach((order) => {
          if (!order.createdAt) return;

          const createdAt = new Date(order.createdAt);

          if (
            !Number.isNaN(createdAt.getTime()) &&
            createdAt >= todayStart &&
            createdAt < todayEnd
          ) {
            newNotifications.push({
              id: `new-order-${order._id}`,
              type: "order",
              title: "New Order Added",
              message: `Order ${order.orderId} - ${order.customerName}`,
            });
          }
        });
      }

      // =====================================
      // LOW STOCK NOTIFICATIONS
      // =====================================

      if (
        notificationSettings.lowStockAlerts &&
        Array.isArray(stockData)
      ) {
        const lowStockLimit = Number(
          notificationSettings.lowStockLimit ?? 100
        );

        stockData.forEach((stock) => {
          const quantity = Number(stock.quantity || 0);

          if (quantity <= lowStockLimit) {
            newNotifications.push({
              id: `low-stock-${stock._id}`,
              type: "stock",
              title: "Low Stock Alert",
              message: `${
                stock.clothType || "Stock"
              } - Only ${quantity.toLocaleString(
                "en-IN"
              )} pieces remaining`,
            });
          }
        });
      }

      // =====================================
      // PAYMENT & DELIVERY NOTIFICATIONS
      // =====================================

      if (Array.isArray(ordersData)) {
        ordersData.forEach((order) => {
          // Payment due today
          if (
            notificationSettings.pendingPaymentAlerts &&
            order.dueDate &&
            Number(order.balanceAmount || 0) > 0
          ) {
            const dueDate = new Date(order.dueDate);

            if (!Number.isNaN(dueDate.getTime())) {
              dueDate.setHours(0, 0, 0, 0);

              if (dueDate.getTime() === todayStart.getTime()) {
                newNotifications.push({
                  id: `payment-${order._id}`,
                  type: "payment",
                  title: "Payment Due Today",
                  message: `Order ${order.orderId} - Balance ₹${Number(
                    order.balanceAmount
                  ).toLocaleString("en-IN")}`,
                });
              }
            }
          }

          // Delivery due today
          if (
            order.deliveryDate &&
            order.status !== "Dispatched"
          ) {
            const deliveryDate = new Date(order.deliveryDate);

            if (!Number.isNaN(deliveryDate.getTime())) {
              deliveryDate.setHours(0, 0, 0, 0);

              if (
                deliveryDate.getTime() === todayStart.getTime()
              ) {
                newNotifications.push({
                  id: `delivery-${order._id}`,
                  type: "delivery",
                  title: "Delivery Due Today",
                  message: `Order ${order.orderId} - ${order.customerName}`,
                });
              }
            }
          }
        });
      }

      // =====================================
      // MAINTENANCE NOTIFICATIONS
      // =====================================

      if (
        notificationSettings.maintenanceAlerts &&
        Array.isArray(maintenanceData)
      ) {
        maintenanceData.forEach((maintenance) => {
          if (!maintenance.maintenanceDate) return;

          const maintenanceDate = new Date(
            maintenance.maintenanceDate
          );

          if (Number.isNaN(maintenanceDate.getTime())) return;

          maintenanceDate.setHours(0, 0, 0, 0);

          if (
            maintenanceDate.getTime() === todayStart.getTime() &&
            maintenance.status !== "Completed"
          ) {
            newNotifications.push({
              id: `maintenance-${maintenance._id}`,
              type: "maintenance",
              title: "Maintenance Due Today",
              message: `${maintenance.machineName} - ${maintenance.issue}`,
            });
          }
        });
      }

      // =====================================
      // REMOVE DUPLICATE NOTIFICATIONS
      // =====================================

      const uniqueNotifications = Array.from(
        new Map(
          newNotifications.map((notification) => [
            notification.id,
            notification,
          ])
        ).values()
      );

      setNotifications(uniqueNotifications);
    } catch (error) {
      console.error(
        "Header notification/production error:",
        error
      );
    }
  }, []);

  // =====================================
  // AUTOMATIC NOTIFICATION REFRESH
  // =====================================

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // =====================================
  // RETURN UI
  // =====================================

  return (
    <header className="header">
      {/* LEFT SIDE */}

      <div className="header-left">
        <h2>Powerloom Production Management</h2>
        <p>Kiruthika Textiles, Pallipalayam</p>
      </div>

      {/* CENTER SUMMARY */}

      <div className="header-center">
        {/* Today's Date */}

        <div className="header-summary-item">
          <div className="header-summary-icon date-icon">
            <CalendarDays size={16} />
          </div>

          <div className="header-summary-content">
            <span>Today</span>
            <strong>{formattedDate}</strong>
          </div>
        </div>

        {/* Today's Production */}

        <div className="header-summary-item">
          <div className="header-summary-icon production-icon">
            <Package size={16} />
          </div>

          <div className="header-summary-content">
            <span>Today's Production</span>
            <strong>
              {todayProduction.toLocaleString("en-IN")} pieces
            </strong>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="header-right">
        {/* NOTIFICATIONS */}

        <div className="notification-container">
          <button
            type="button"
            className="notification-btn"
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <span className="notification-dot">
                {notifications.length}
              </span>
            )}
          </button>

          {/* NOTIFICATION PANEL */}

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  <span>
                    {notifications.length} alert
                    {notifications.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <button
                  type="button"
                  className="notification-close"
                  onClick={() => setShowNotifications(false)}
                  title="Close notifications"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    <Bell size={20} />
                    <p>No notifications for today.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      className={`notification-item ${notification.type}`}
                      key={notification.id}
                    >
                      <div className="notification-item-icon">
                        <Bell size={16} />
                      </div>

                      <div className="notification-item-content">
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* OWNER PROFILE */}

        <div className="profile">
          <div className="profile-icon">
            <User size={19} />
          </div>

          <div className="profile-info">
            <strong>Owner</strong>
            <span>Saravanan</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;