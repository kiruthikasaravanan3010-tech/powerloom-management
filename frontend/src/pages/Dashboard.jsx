import { useEffect, useState } from "react";
import {
  Factory,
  Users,
  UserCircle,
  ClipboardList,
  Package,
  Activity,
  ArrowRight,
  TrendingUp
} from "lucide-react";

function Dashboard({ setPage }) {
  const [summary, setSummary] = useState({
    totalProduction: 0,
    todayProduction: 0,
    totalEntries: 0,
    machineProduction: {}
  });

  const [machines, setMachines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        summaryResponse,
        machinesResponse,
        operatorsResponse,
        customersResponse,
        ordersResponse
      ] = await Promise.all([
        fetch("http://localhost:5000/api/production/summary"),
        fetch("http://localhost:5000/api/machines"),
        fetch("http://localhost:5000/api/operators"),
        fetch("http://localhost:5000/api/customers"),
        fetch("http://localhost:5000/api/orders")
      ]);

      const summaryData = await summaryResponse.json();
      const machinesData = await machinesResponse.json();
      const operatorsData = await operatorsResponse.json();
      const customersData = await customersResponse.json();
      const ordersData = await ordersResponse.json();

      setSummary(summaryData);
      setMachines(machinesData);
      setOperators(operatorsData);
      setCustomers(customersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="dashboard-loading">
          <Activity size={28} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const runningMachines = machines.filter(
    (machine) => machine.status === "Running"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const productionMachines = Object.entries(
    summary.machineProduction || {}
  );

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <div className="page-header dashboard-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of Kiruthika Textiles production activities
          </p>
        </div>

        <div className="dashboard-date">
          <Activity size={17} />
          <span>Production Overview</span>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="stats-grid dashboard-stats">

        <div className="stat-card dashboard-stat-card">
          <div className="stat-icon production-icon">
            <Package size={22} />
          </div>

          <div className="stat-content">
            <span>Total Production</span>
            <h2>
              {Number(summary.totalProduction || 0).toLocaleString("en-IN")}
            </h2>
            <small>pieces</small>
          </div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-icon today-icon">
            <Activity size={22} />
          </div>

          <div className="stat-content">
            <span>Today's Production</span>
            <h2>
              {Number(summary.todayProduction || 0).toLocaleString("en-IN")}
            </h2>
            <small>pieces today</small>
          </div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-icon machine-icon">
            <Factory size={22} />
          </div>

          <div className="stat-content">
            <span>Total Machines</span>
            <h2>{machines.length}</h2>
            <small>{runningMachines} currently running</small>
          </div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-icon operator-icon">
            <Users size={22} />
          </div>

          <div className="stat-content">
            <span>Total Operators</span>
            <h2>{operators.length}</h2>
            <small>registered operators</small>
          </div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-icon customer-icon">
            <UserCircle size={22} />
          </div>

          <div className="stat-content">
            <span>Total Customers</span>
            <h2>{customers.length}</h2>
            <small>registered customers</small>
          </div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-icon order-icon">
            <ClipboardList size={22} />
          </div>

          <div className="stat-content">
            <span>Total Orders</span>
            <h2>{orders.length}</h2>
            <small>{pendingOrders} pending orders</small>
          </div>
        </div>

      </div>

      {/* MACHINE + ORDERS */}
      <div className="dashboard-grid">

        {/* MACHINE STATUS */}
        <div className="content-card dashboard-panel">

          <div className="card-header">
            <div>
              <h2>Machine Status</h2>
              <p>Current machine overview</p>
            </div>

            <button
              className="text-btn"
              onClick={() => setPage("machines")}
            >
              View All
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="dashboard-list">

            {machines.length === 0 ? (
              <div className="empty-dashboard">
                <Factory size={30} />
                <p>No machines available.</p>
              </div>
            ) : (
              machines.slice(0, 5).map((machine) => (
                <div
                  className="dashboard-list-item"
                  key={machine._id}
                >
                  <div className="dashboard-item-icon">
                    <Factory size={18} />
                  </div>

                  <div className="dashboard-item-info">
                    <strong>{machine.machineName}</strong>
                    <span>{machine.machineId}</span>
                  </div>

                  <span
                    className={`status ${machine.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {machine.status}
                  </span>
                </div>
              ))
            )}

          </div>

          <div className="small-summary">
            <div>
              <span>Running Machines</span>
              <small>Currently active</small>
            </div>

            <strong>{runningMachines}</strong>
          </div>

        </div>

        {/* RECENT ORDERS */}
        <div className="content-card dashboard-panel">

          <div className="card-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer orders</p>
            </div>

            <button
              className="text-btn"
              onClick={() => setPage("orders")}
            >
              View All
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="dashboard-list">

            {orders.length === 0 ? (
              <div className="empty-dashboard">
                <ClipboardList size={30} />
                <p>No orders available.</p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div
                  className="dashboard-list-item"
                  key={order._id}
                >
                  <div className="dashboard-item-icon">
                    <ClipboardList size={18} />
                  </div>

                  <div className="dashboard-item-info">
                    <strong>{order.orderId}</strong>
                    <span>{order.customerName}</span>
                  </div>

                  <span
                    className={`status ${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            )}

          </div>

          <div className="small-summary">
            <div>
              <span>Pending Orders</span>
              <small>Orders awaiting action</small>
            </div>

            <strong>{pendingOrders}</strong>
          </div>

        </div>

      </div>

      {/* PRODUCTION BY MACHINE */}
      <div className="content-card production-summary-card">

        <div className="card-header">
          <div>
            <h2>Production by Machine</h2>
            <p>Total production recorded for each machine</p>
          </div>

          <button
            className="text-btn"
            onClick={() => setPage("production-history")}
          >
            Production Records
            <ArrowRight size={15} />
          </button>
        </div>

        {productionMachines.length === 0 ? (
          <div className="empty-dashboard">
            <TrendingUp size={30} />
            <p>No production records available.</p>
          </div>
        ) : (
          <div className="machine-production-list">

            {productionMachines.map(([machine, quantity]) => (
              <div
                className="machine-production-item"
                key={machine}
              >
                <div className="machine-production-info">
                  <div className="machine-production-icon">
                    <Factory size={17} />
                  </div>

                  <div>
                    <strong>{machine}</strong>
                    <span>Machine Production</span>
                  </div>
                </div>

                <div className="machine-production-value">
                  <strong>
                    {Number(quantity || 0).toLocaleString("en-IN")}
                  </strong>
                  <span>pieces</span>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;