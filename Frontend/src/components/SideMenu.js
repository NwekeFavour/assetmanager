import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings,
  LocateFixed, 
} from "lucide-react"; // Install lucide-react for sharper icons
import { CubeIcon } from "@heroicons/react/24/outline";

function SideMenu() {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Disposals & Transfers", href: "/sales", icon: BarChart3 },
    { name: "Categories", href: "#", icon: CubeIcon },
    { name: "Locations", href: "#", icon: LocateFixed },
  ];

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-gray-200 bg-white hidden lg:flex fixed left-0 top-0">
      <div className="px-4 py-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="h-9 w-9 bg-[#8f5273] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
             <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Assets</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 transition-colors cursor-pointer group">
          <img
            alt="Profile"
            src={userData.imageUrl || `https://ui-avatars.com/api/?name=${userData.firstName}`}
            className="h-10 w-10 rounded-lg object-cover ring-2 ring-white shadow-sm"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{userData.email}</p>
          </div>
          <Settings className="h-4 w-4 text-gray-400 group-hover:rotate-90 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default SideMenu;