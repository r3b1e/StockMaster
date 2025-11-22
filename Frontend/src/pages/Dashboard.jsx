import { useEffect, useState } from 'react';
import api from '../utils/api';

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    scheduledTransfers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    documentType: '',
    status: '',
    warehouse: '',
    category: '',
  });
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchKPIs();
    fetchWarehouses();
    fetchCategories();
    fetchDocuments();
  }, [filters]);

  const fetchKPIs = async () => {
    try {
      const data = await api.get('/dashboard/kpis');
      setKpis(data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await api.get('/warehouses');
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/products/categories/list');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.documentType) params.append('documentType', filters.documentType);
      if (filters.status) params.append('status', filters.status);
      if (filters.warehouse) params.append('warehouse', filters.warehouse);

      const data = await api.get(`/dashboard/data?${params.toString()}`);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const kpiCards = [
    { 
      title: 'Total Products', 
      value: kpis.totalProducts, 
      gradient: 'from-blue-500 to-blue-600',
      icon: '📦',
      bgIcon: '🔵'
    },
    { 
      title: 'Low Stock Items', 
      value: kpis.lowStockItems, 
      gradient: 'from-yellow-500 to-orange-500',
      icon: '⚠️',
      bgIcon: '🟡'
    },
    { 
      title: 'Out of Stock', 
      value: kpis.outOfStockItems, 
      gradient: 'from-red-500 to-red-600',
      icon: '❌',
      bgIcon: '🔴'
    },
    { 
      title: 'Pending Receipts', 
      value: kpis.pendingReceipts, 
      gradient: 'from-green-500 to-emerald-600',
      icon: '📥',
      bgIcon: '🟢'
    },
    { 
      title: 'Pending Deliveries', 
      value: kpis.pendingDeliveries, 
      gradient: 'from-purple-500 to-purple-600',
      icon: '📤',
      bgIcon: '🟣'
    },
    { 
      title: 'Scheduled Transfers', 
      value: kpis.scheduledTransfers, 
      gradient: 'from-indigo-500 to-indigo-600',
      icon: '🔄',
      bgIcon: '🔵'
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'status-badge status-draft',
      waiting: 'status-badge status-waiting',
      ready: 'status-badge status-ready',
      done: 'status-badge status-done',
      canceled: 'status-badge status-canceled',
    };
    return badges[status] || 'status-badge status-draft';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => (
          <div
            key={kpi.title}
            className="card shadow-lg-hover relative overflow-hidden group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {kpi.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className={`text-4xl font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent`}>
                    {kpi.value}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Last updated: Just now</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Receipt">Receipts</option>
              <option value="DeliveryOrder">Delivery Orders</option>
              <option value="Transfer">Transfers</option>
              <option value="Adjustment">Adjustments</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="ready">Ready</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={filters.warehouse}
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
            >
              <option value="">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="card shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h3 className="text-lg font-bold flex items-center">
            <span className="mr-2">📋</span>
            Recent Operations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.slice(0, 10).map((doc, index) => (
                <tr key={`${doc.type}-${doc.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.receiptNumber || doc.orderNumber || doc.transferNumber || doc.adjustmentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(doc.status)}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No recent operations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
