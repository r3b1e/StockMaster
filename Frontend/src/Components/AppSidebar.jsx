import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  ClipboardList,
  History,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Products', url: '/products', icon: Package },
  { title: 'Receipts', url: '/receipts', icon: ArrowDownToLine },
  { title: 'Deliveries', url: '/deliveries', icon: ArrowUpFromLine },
  { title: 'Transfers', url: '/transfers', icon: ArrowLeftRight },
  { title: 'Adjustments', url: '/adjustments', icon: ClipboardList },
  { title: 'Stock History', url: '/history', icon: History },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    // Add your sign out logic here
  };

  const NavItem = ({ item }) => {
    const active = isActive(item.url);
    const Icon = item.icon;

    return (
      <Link
        to={item.url}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-[#714B67] text-white font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span className="text-sm">{item.title}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-100"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#714B67]">
                  <Package className="h-5 w-5 text-white" />
                </div>
                {!collapsed && (
                  <div>
                    <h2 className="text-lg font-bold text-[#2C2C36]">StockMaster</h2>
                    <p className="text-xs text-gray-500">Inventory System</p>
                  </div>
                )}
              </div>
              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:block p-1.5 rounded hover:bg-gray-100 text-gray-600"
              >
                {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Navigation
                </p>
              )}
              {menuItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
