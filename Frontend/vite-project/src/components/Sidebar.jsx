import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Tag,
  Truck,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  Store,
  Database,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const getLinkClassName = (path) =>
    location.pathname.startsWith(path)
      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
      : "text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar w-64 bg-gray-900 text-gray-200 flex flex-col p-4 fixed inset-y-0 border-r border-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-700">

      <div className="flex flex-col flex-1">
        <div className="flex flex-col items-center">
  <div className="  py-6 shadow-md flex items-center justify-center">
  <div className="flex flex-col ">
  <h2 className="text-[#E9DFC3] text-2xl font-extrabold tracking-tight italic drop-shadow-lg">
    <span className="text-[#4E71FF]">Munna</span> Enterprise
  </h2>
  
</div>

</div>


  
</div>


        <nav className="space-y-2 flex-1">
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/dashboard")}`}>
            <LayoutDashboard size={18} className="text-white" />
            <span className="text-white">Dashboard</span>
          </Link>
          <Link to="/products" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/products")}`}>
            <ShoppingCart size={18} className="text-white" />
            <span className="text-white">Products</span>
          </Link>
          <Link to="/suppliers" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/suppliers")}`}>
            <Users size={18} className="text-white" />
            <span className="text-white">Suppliers</span>
          </Link>
          <Link to="/stock" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/stock")}`}>
            <Database size={18} className="text-white" />
            <span className="text-white">Stock</span>
          </Link>
          <Link to="/purchases" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/purchases")}`}>
            <TrendingUp size={18} className="text-white" />
            <span className="text-white">Purchases</span>
          </Link>
          <Link to="/sales" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/sales")}`}>
            <DollarSign size={18} className="text-white" />
            <span className="text-white">Sales</span>
          </Link>
          <Link to="/expenses" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/expenses")}`}>
            <FileText size={18} className="text-white" />
            <span className="text-white">Expenses</span>
          </Link>
          <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/reports")}`}>
            <BarChart3 size={18} className="text-white" />
            <span className="text-white">Reports</span>
          </Link>
          <Link to="/categories" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/categories")}`}>
            <Tag size={18} className="text-white" />
            <span className="text-white">Categories</span>
          </Link>
          <Link to="/vehicles" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/vehicles")}`}>
            <Truck size={18} className="text-white" />
            <span className="text-white">Vehicles</span>
          </Link>
          <Link to="/godown" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/godown")}`}>
            <Store size={18} className="text-white" />
            <span className="text-white">Godown</span>
          </Link>
        </nav>

        {isAuthenticated && (
          <div className="mt-6">
            {/* Settings collapsible */}
            <div
              className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-white" />
                <span className="text-white">Settings</span>
              </div>
              {settingsOpen ? <ChevronUp size={16} className="text-white" /> : <ChevronDown size={16} className="text-white" />}
            </div>

            {settingsOpen && (
              <div className="pl-8 mt-2 flex flex-col gap-1">
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getLinkClassName("/profile")}`}
                >
                  <User size={16} className="text-white" />
                  <span className="text-white">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200"
                >
                  <LogOut size={16} className="text-white" />
                  <span className="text-white">Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
