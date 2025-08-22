import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Tag,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const getLinkClassName = (path) =>
    location.pathname.startsWith(path)
      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
      : "text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200";

  return (
    <aside className="sidebar w-64 bg-gray-900 text-gray-200 flex flex-col p-4 fixed h-full border-r border-gray-800">
      {/* Brand / Logo */}
      <h2 className="text-2xl font-bold mb-8 text-indigo-400 tracking-wide">
        Munna Enterprise
      </h2>

      {/* Navigation */}
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/dashboard"
          )}`}
        >
          <LayoutDashboard size={18} className="text-white" />
          <span className="text-white">Dashboard</span>
        </Link>

        <Link
          to="/products"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/products"
          )}`}
        >
          <ShoppingCart size={18} className="text-white" />
          <span className="text-white">Products</span>
        </Link>

        <Link
          to="/suppliers"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/suppliers"
          )}`}
        >
          <Users size={18} className="text-white" />
          <span className="text-white">Suppliers</span>
        </Link>

        <Link
          to="/purchases"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/purchases"
          )}`}
        >
          <TrendingUp size={18} className="text-white" />
          <span className="text-white">Purchases</span>
        </Link>

        <Link
          to="/sales"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/sales"
          )}`}
        >
          <DollarSign size={18} className="text-white" />
          <span className="text-white">Sales</span>
        </Link>

        <Link
          to="/expenses"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/expenses"
          )}`}
        >
          <FileText size={18} className="text-white" />
          <span className="text-white">Expenses</span>
        </Link>

        <Link
          to="/reports"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/reports"
          )}`}
        >
          <BarChart3 size={18} className="text-white" />
          <span className="text-white">Reports</span>
        </Link>

        {/* Link to the Category page */}
        <Link
          to="/categories"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName(
            "/categories"
          )}`}
        >
          <Tag size={18} className="text-white" />
          <span className="text-white">Categories</span>
        </Link>
      </nav>
    </aside>
  );
}
