import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { name: 'Products', href: '/products', icon: '📦', color: 'from-purple-500 to-purple-600' },
    { name: 'Receipts', href: '/receipts', icon: '📥', color: 'from-green-500 to-green-600' },
    { name: 'Delivery Orders', href: '/delivery-orders', icon: '📤', color: 'from-orange-500 to-orange-600' },
    { name: 'Internal Transfers', href: '/transfers', icon: '🔄', color: 'from-cyan-500 to-cyan-600' },
    { name: 'Adjustments', href: '/adjustments', icon: '⚖️', color: 'from-pink-500 to-pink-600' },
    { name: 'Move History', href: '/move-history', icon: '📋', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Warehouses', href: '/warehouses', icon: '🏭', color: 'from-gray-500 to-gray-600' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileMenuOpen) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileMenuOpen]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className={`${sidebarOpen ? 'flex' : 'hidden'} items-center space-x-2`}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              SM
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              StockMaster
            </h1>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className={`${sidebarOpen ? 'block' : 'hidden'} font-medium`}>{item.name}</span>
                {!sidebarOpen && (
                  <div className="absolute left-20 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Menu */}
        <div className="p-4 border-t border-gray-700 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen(!profileMenuOpen);
            }}
            className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className={`${sidebarOpen ? 'block' : 'hidden'} flex-1 text-left`}>
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
            <span className={`${sidebarOpen ? 'block' : 'hidden'} ml-auto`}>▼</span>
          </button>
          {profileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 animate-fadeIn">
              <Link
                to="/profile"
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={() => setProfileMenuOpen(false)}
              >
                👤 My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-red-600 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="animate-fadeIn">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
