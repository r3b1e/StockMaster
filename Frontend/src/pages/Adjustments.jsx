import { useState, useEffect } from 'react';
import api from '../utils/api';

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    items: [{ product: '', warehouse: '', location: '', physicalQuantity: 0, reason: '' }],
    notes: '',
  });

  useEffect(() => {
    fetchAdjustments();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/adjustments');
      setAdjustments(data);
    } catch (error) {
      console.error('Error fetching adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleCreate = () => {
    setFormData({
      items: [{ product: '', warehouse: '', location: '', physicalQuantity: 0, reason: '' }],
      notes: '',
    });
    setShowModal(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', warehouse: '', location: '', physicalQuantity: 0, reason: '' }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'physicalQuantity' ? Number(value) : value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/adjustments', formData);
      setShowModal(false);
      fetchAdjustments();
    } catch (error) {
      alert(error.message || 'Error creating adjustment');
    }
  };

  const handleValidate = async (id) => {
    if (!confirm('Are you sure you want to validate this adjustment? Stock will be updated.')) return;
    try {
      await api.post(`/adjustments/${id}/validate`);
      fetchAdjustments();
    } catch (error) {
      alert(error.message || 'Error validating adjustment');
    }
  };

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Adjustments</h1>
          <p className="text-gray-600">Fix stock discrepancies and update inventory counts</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>New Adjustment</span>
        </button>
      </div>

      {/* Adjustments Table */}
      <div className="card shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading adjustments...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-pink-500 to-rose-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Adjustment Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-indigo-600">{adjustment.adjustmentNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {adjustment.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(adjustment.status)}>
                        {adjustment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(adjustment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {adjustment.status !== 'done' && adjustment.status !== 'canceled' && (
                        <button
                          onClick={() => handleValidate(adjustment.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                        >
                          Validate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {adjustments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">⚖️</span>
                        <p className="text-lg font-medium">No adjustments found</p>
                        <p className="text-sm">Create your first adjustment to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay animate-fadeIn p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">New Stock Adjustment</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Adjustment Items</label>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 mb-2 px-2">
                    <div className="col-span-3">Product</div>
                    <div className="col-span-2">Warehouse</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2">Physical Qty</div>
                    <div className="col-span-2">Reason</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-xl">
                      <select
                        required
                        className="col-span-3 border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white text-sm"
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      >
                        <option value="">Product</option>
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                      <select
                        required
                        className="col-span-2 border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white text-sm"
                        value={item.warehouse}
                        onChange={(e) => handleItemChange(index, 'warehouse', e.target.value)}
                      >
                        <option value="">Warehouse</option>
                        {warehouses.map((wh) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Location"
                        className="col-span-2 border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
                        value={item.location}
                        onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                      />
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="Qty"
                        className="col-span-2 border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
                        value={item.physicalQuantity}
                        onChange={(e) => handleItemChange(index, 'physicalQuantity', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Reason"
                        className="col-span-2 border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
                        value={item.reason}
                        onChange={(e) => handleItemChange(index, 'reason', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="col-span-1 text-red-600 hover:text-red-800 font-semibold text-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-2 text-pink-600 hover:text-pink-700 font-semibold text-sm border-2 border-dashed border-pink-300 rounded-xl hover:bg-pink-50 transition-all"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 rounded-xl text-white font-semibold"
                >
                  Create Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adjustments;
