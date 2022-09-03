import { useState } from "react";
import { Route, Routes } from "react-router";
import Error404 from "../common/Error404";
import ActionLog from "./action-log/ActionLog";
import CategoryTable from "./category/CategoryTable";
import CompanyInfo from "./company-info/CompanyInfo";
import ExpensesTable from "./expenses/ExpensesTable";
import Home from "./Home/Home";
import MakeOrder from "./make-order/MakeOrder";
import OrdersTable from "./orders/OrdersTable";
import ProductTable from "./product/ProductTable";
import NavBar from "./static/NavBar";
import SideBar from "./static/SideBar";
import GroupTable from "./system-user/groups/GroupTable";
import UsersTable from "./system-user/users/UsersTable";
import Table from "./table/Table";
import MakeOrderStaff from "./make-orders-staff/MakeOrderStaff";
import StaffOrderPage from "./make-orders-staff/integrate/order/StaffOrderPage";
import AllReports from "./reports/all-reports/AllReports";
import AuditTrailReport from "./reports/audit-trail-report/AuditTrailReport";
import ProductWiseReport from "./reports/product-wise-report/ProductWiseReport";
import SalesReturn from "./sales-return/SalesReturn";
import SalesReturnReport from "./sales-return/SalesReturnReport";
import PrintReport from "./reports/PrintReport";
import Backup from "./Backup/Backup";
import Profile from "./profile/Profile";

function DashboardManagement() {
  const nav = window.location.pathname.split("/")[2];
  const [toggleSidebar, setToggleSideBar] = useState(false);
  return (
    <div
      className={`bg-white ${
        nav !== "print-report" && "dark:bg-gray-900"
      }  h-screen flex font-inter relative`}
    >
      <SideBar
        mobile={false}
        isToggle={toggleSidebar}
        toggle={() => setToggleSideBar(false)}
        setToggleSideBar={() => {}}
      />
      <div className="flex-1 flex flex-col h-screen overflow-auto z-20">
        {nav !== "print-report" && (
          <NavBar toggle={setToggleSideBar} isToggle={toggleSidebar} />
        )}
        <div className="  px-6 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company-info" element={<CompanyInfo />} />
            <Route path="/system-users" element={<UsersTable />} />
            <Route path="/system-groups" element={<GroupTable />} />
            <Route path="/table" element={<Table />} />
            <Route path="/category" element={<CategoryTable />} />
            <Route path="/products" element={<ProductTable />} />
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/make-orders" element={<MakeOrder />} />
            <Route path="/make-orders/:id" element={<MakeOrder />} />
            <Route path="/:name/orders/:id" element={<MakeOrder />} />
            <Route path="/action-logs" element={<ActionLog />} />
            <Route path="/expenses" element={<ExpensesTable />} />
            <Route path="/make-orders-staff" element={<MakeOrderStaff />} />
            <Route
              path="/make-orders-staff/:tableId"
              element={<StaffOrderPage />}
            />
            <Route
              path="/make-orders-staff/:tableId/:id"
              element={<StaffOrderPage />}
            />
            <Route path="/report" element={<AllReports />} />
            <Route path="/print-report/:id" element={<PrintReport />} />
            <Route path="/sales-return" element={<SalesReturn />} />
            <Route
              path="/sales-return-report"
              element={<SalesReturnReport />}
            />
            <Route
              path="/report/audit-trail-report"
              element={<AuditTrailReport />}
            />
            <Route
              path="/report/product-wise-report"
              element={<ProductWiseReport />}
            />
            <Route path="/backup" element={<Backup />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DashboardManagement;
