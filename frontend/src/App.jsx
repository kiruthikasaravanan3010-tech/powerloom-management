import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import AddProduction from "./pages/Production/AddProduction";
import DailyProduction from "./pages/Production/DailyProduction";
import ProductionHistory from "./pages/Production/ProductionHistory";

import MachineList from "./pages/Machines/MachineList";
import MachineDetails from "./pages/Machines/MachineDetails";
import Maintenance from "./pages/Machines/Maintenance";
import AddMachine from "./pages/Machines/AddMachine";
import EditMachine from "./pages/Machines/EditMachine";

import OperatorList from "./pages/Operators/OperatorList";
import AddOperator from "./pages/Operators/AddOperator";
import OperatorPerformance from "./pages/Operators/OperatorPerformance";
import EditOperator from "./pages/Operators/EditOperator";

import Reports from "./pages/Reports/Reports";
import DailyReport from "./pages/Reports/DailyReport";
import WeeklyReport from "./pages/Reports/WeeklyReport";
import MonthlyReport from "./pages/Reports/MonthlyReport";
import MachineReport from "./pages/Reports/MachineReport";

import CustomerList from "./pages/Customers/CustomerList";
import Orders from "./pages/Customers/Orders";
import FabricCalculator from "./pages/FabricCalculator";
import Settings from "./pages/Settings";

import AddCustomer from "./pages/Customers/AddCustomer";
import AddOrder from "./pages/Customers/AddOrder";
import EditOrder from "./pages/Customers/EditOrder";
import EditCustomer from "./pages/Customers/EditCustomer";

import EditProduction from "./pages/Production/EditProduction";
import EditMaintenance from "./pages/Machines/EditMaintenance";

import Stock from "./pages/Stock";
import AddPayment from "./pages/Customers/AddPayment";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  setLoggedIn(false);
};

  const [page, setPage] = useState("dashboard");

  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const [selectedMaintenanceId, setSelectedMaintenanceId] =
    useState(null);

  const [selectedOperatorId, setSelectedOperatorId] =
    useState(null);

  const [selectedCustomerId, setSelectedCustomerId] =
    useState(null);

  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  const [selectedProductionId, setSelectedProductionId] =
    useState(null);

  const renderPage = () => {
    switch (page) {

      /* ================= DASHBOARD ================= */

      case "dashboard":
        return <Dashboard setPage={setPage} />;


      /* ================= PRODUCTION ================= */

      case "add-production":
        return <AddProduction />;

      case "daily-production":
        return <DailyProduction />;

      case "production-history":
        return (
          <ProductionHistory
            setPage={setPage}
            setSelectedProductionId={setSelectedProductionId}
          />
        );

      case "edit-production":
        return (
          <EditProduction
            productionId={selectedProductionId}
            setPage={setPage}
          />
        );


      /* ================= STOCK ================= */

      case "stock":
        return <Stock />;


      /* ================= MACHINES ================= */

      case "add-machine":
        return <AddMachine />;

      case "machines":
        return (
          <MachineList
            setPage={setPage}
            setSelectedMachineId={setSelectedMachineId}
          />
        );

      case "machine-details":
        return (
          <MachineDetails
            machineId={selectedMachineId}
            setPage={setPage}
          />
        );

      case "edit-machine":
        return (
          <EditMachine
            machineId={selectedMachineId}
            setPage={setPage}
          />
        );

      case "maintenance":
        return (
          <Maintenance
            setPage={setPage}
            setSelectedMaintenanceId={setSelectedMaintenanceId}
          />
        );

      case "edit-maintenance":
        return (
          <EditMaintenance
            maintenanceId={selectedMaintenanceId}
            setPage={setPage}
          />
        );


      /* ================= OPERATORS ================= */

      case "operators":
        return (
          <OperatorList
            setPage={setPage}
            setSelectedOperatorId={setSelectedOperatorId}
          />
        );

      case "edit-operator":
        return (
          <EditOperator
            operatorId={selectedOperatorId}
            setPage={setPage}
          />
        );

      case "add-operator":
        return <AddOperator />;

      case "operator-performance":
        return <OperatorPerformance />;


      /* ================= REPORTS ================= */

      case "reports":
        return <Reports setPage={setPage} />;

      case "daily-report":
        return <DailyReport />;

      case "weekly-report":
        return <WeeklyReport />;

      case "monthly-report":
        return <MonthlyReport />;

      case "machine-report":
        return <MachineReport />;


      /* ================= CUSTOMERS ================= */

      case "customers":
        return (
          <CustomerList
            setPage={setPage}
            setSelectedCustomerId={setSelectedCustomerId}
          />
        );

      case "edit-customer":
        return (
          <EditCustomer
            customerId={selectedCustomerId}
            setPage={setPage}
          />
        );

      case "add-customer":
        return <AddCustomer />;


      /* ================= ORDERS ================= */

      case "orders":
        return (
          <Orders
            setPage={setPage}
            setSelectedOrderId={setSelectedOrderId}
          />
        );

      case "add-order":
        return <AddOrder />;

      case "edit-order":
        return (
          <EditOrder
            orderId={selectedOrderId}
            setPage={setPage}
          />
        );

      case "add-payment":
        return (
          <AddPayment
            setPage={setPage}
            selectedOrderId={selectedOrderId}
          />
        );


      /* ================= FABRIC CALCULATOR ================= */

      case "fabric-calculator":
        return <FabricCalculator />;


      /* ================= SETTINGS ================= */

     case "settings":
  return <Settings onLogout={handleLogout} />;


      /* ================= DEFAULT ================= */

      default:
        return <Dashboard setPage={setPage} />;
    }
  };


  /* ================= LOGIN ================= */

  if (!loggedIn) {
    return (
      <Login setLoggedIn={setLoggedIn} />
    );
  }


  /* ================= MAIN APPLICATION ================= */

  return (
    <div className="app">

      <Sidebar
        setPage={setPage}
        currentPage={page}
      />

      <div className="main">

        <Header />

        {renderPage()}

      </div>

    </div>
  );
}

export default App;