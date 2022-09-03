import {
  ActionLogIcon,
  BackupIcon,
  CategoryIcon,
  DashboardIcon,
  ExpensesIcon,
  FormsIcon,
  InfoIcon,
  OrderIcon,
  ProductIcon,
  ProfileIcon,
  ReturnIcon,
  TablesIcon,
} from "../../../assets/icons";

export const routes = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon className="w-5 h-5" />,
  },
  {
    path: "/dashboard/company-info",
    title: "Company Info",
    icon: <InfoIcon className="w-5 h-5" />,
  },
  {
    title: "System Users",
    icon: <ProfileIcon className="w-5 h-5" />,
    subMenu: [
      {
        name: "Users",
        path: "/dashboard/system-users",
      },
      {
        name: "Groups",
        path: "/dashboard/system-groups",
      },
    ],
  },
  {
    path: "/dashboard/table",
    title: "Tables",
    icon: <TablesIcon className="w-5 h-5" />,
  },
  {
    path: "/dashboard/category",
    title: "Category",
    icon: <CategoryIcon className="w-5 h-5" />,
  },
  {
    path: "/dashboard/products",
    title: "Products",
    icon: <ProductIcon className="w-5 h-5" />,
  },
  {
    path: "/dashboard/orders",
    title: "Orders",
    icon: <OrderIcon className="w-5 h-5" />,
  },
  {
    path: "/dashboard/expenses",
    title: "Expenses",
    icon: <ExpensesIcon className="w-5 h-5" />,
  },
  {
    title: "Sales Return",
    icon: <ReturnIcon className="w-5 h-5" />,
    subMenu: [
      {
        name: "Sales Return",
        path: "/dashboard/sales-return",
      },
      {
        name: "Sales Return Report",
        path: "/dashboard/sales-return-report",
      },
    ],
  },
  {
    title: "Reports",
    icon: <FormsIcon className="w-5 h-5" />,
    subMenu: [
      {
        name: "All Report",
        path: "/dashboard/report",
      },
      {
        name: "Audit Trail Report",
        path: "/dashboard/report/audit-trail-report",
      },
      {
        name: "Product Wise Report",
        path: "/dashboard/report/product-wise-report",
      },
    ],
  },
  {
    path: "/dashboard/action-logs",
    title: "Action Logs",
    icon: <ActionLogIcon className="w-5 h-5" />,
  },
  {
    path: "/dashboard/backup",
    title: "Backup",
    icon: <BackupIcon className="w-5 h-5" />,
  },
];
