import {
  LayoutDashboard,
  Factory,
  Settings,
  Users,
  FileText,
  UserCircle,
  Wrench,
  ClipboardList,
  Package,
  Calculator
} from "lucide-react";

function Sidebar({ setPage, currentPage }) {
  return (
    <div className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <img
          src="/images/kt-logo.png"
          alt="Kiruthika Textiles"
        />
      </div>

      <div className="menu">

        {/* DASHBOARD */}
        <button
          className={currentPage === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        {/* PRODUCTION */}
        <p className="menu-title">PRODUCTION</p>

        <button
          className={currentPage === "add-production" ? "active" : ""}
          onClick={() => setPage("add-production")}
        >
          <ClipboardList size={20} />
          Add Production
        </button>

        <button
          className={currentPage === "daily-production" ? "active" : ""}
          onClick={() => setPage("daily-production")}
        >
          <FileText size={20} />
          Daily Production
        </button>

        <button
          className={currentPage === "production-history" ? "active" : ""}
          onClick={() => setPage("production-history")}
        >
          <FileText size={20} />
          Production History
        </button>

        <button
          className={currentPage === "stock" ? "active" : ""}
          onClick={() => setPage("stock")}
        >
          <Package size={20} />
          Stock
        </button>

        {/* MACHINES */}
        <p className="menu-title">MACHINES</p>

        <button
          className={currentPage === "machines" ? "active" : ""}
          onClick={() => setPage("machines")}
        >
          <Factory size={20} />
          Machines
        </button>

        <button
          className={currentPage === "add-machine" ? "active" : ""}
          onClick={() => setPage("add-machine")}
        >
          <Factory size={20} />
          Add Machine
        </button>

        <button
          className={currentPage === "maintenance" ? "active" : ""}
          onClick={() => setPage("maintenance")}
        >
          <Wrench size={20} />
          Maintenance
        </button>

        {/* OPERATORS */}
        <p className="menu-title">OPERATORS</p>

        <button
          className={currentPage === "operators" ? "active" : ""}
          onClick={() => setPage("operators")}
        >
          <Users size={20} />
          Operators
        </button>

        <button
          className={currentPage === "add-operator" ? "active" : ""}
          onClick={() => setPage("add-operator")}
        >
          <Users size={20} />
          Add Operator
        </button>

        {/* REPORTS */}
        <p className="menu-title">REPORTS</p>

        <button
          className={currentPage === "reports" ? "active" : ""}
          onClick={() => setPage("reports")}
        >
          <FileText size={20} />
          Reports
        </button>

        {/* OTHERS */}
        <p className="menu-title">OTHERS</p>

        <button
          className={currentPage === "customers" ? "active" : ""}
          onClick={() => setPage("customers")}
        >
          <UserCircle size={20} />
          Customers
        </button>

        <button
          className={currentPage === "add-customer" ? "active" : ""}
          onClick={() => setPage("add-customer")}
        >
          <UserCircle size={20} />
          Add Customer
        </button>

        <button
          className={currentPage === "orders" ? "active" : ""}
          onClick={() => setPage("orders")}
        >
          <ClipboardList size={20} />
          Orders
        </button>

        <button
          className={currentPage === "add-order" ? "active" : ""}
          onClick={() => setPage("add-order")}
        >
          <ClipboardList size={20} />
          Add Order
        </button>

        <button
          className={
            currentPage === "fabric-calculator" ? "active" : ""
          }
          onClick={() => setPage("fabric-calculator")}
        >
          <Calculator size={20} />
          Fabric Calculator
        </button>

        {/* SETTINGS */}
        <button
          className={currentPage === "settings" ? "active" : ""}
          onClick={() => setPage("settings")}
        >
          <Settings size={20} />
          Settings
        </button>

      </div>
    </div>
  );
}

export default Sidebar;