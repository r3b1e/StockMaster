import { useState } from 'react';
import { Plus, ClipboardList, X, Calendar, MapPin, TrendingUp, TrendingDown } from 'lucide-react';

// Button Component
const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button' }) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-[#714B67] text-white hover:bg-[#5a3b52] focus:ring-[#714B67]',
    secondary: 'bg-gray-200 text-[#2C2C36] hover:bg-gray-300 focus:ring-gray-400'
  };
  
  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Badge Component
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    increase: 'bg-green-100 text-green-700 border-green-200',
    decrease: 'bg-red-100 text-red-700 border-red-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Input Component
const Input = ({ label, placeholder, value, onChange, className = '', type = 'text' }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent ${className}`}
    />
  </div>
);

// Select Component
const Select = ({ label, value, onChange, options, placeholder }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent bg-white"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-[#2C2C36]">{children}</h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#2C2C36]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Adjustment Form Component
const AdjustmentForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    adjustmentNumber: '',
    adjustmentDate: '',
    location: '',
    reason: '',
    notes: ''
  });

  const [items, setItems] = useState([
    { id: 1, product: '', currentQuantity: '', adjustedQuantity: '', type: 'increase' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adjustment data:', { ...formData, items });
    onSuccess();
    onClose();
    setFormData({
      adjustmentNumber: '',
      adjustmentDate: '',
      location: '',
      reason: '',
      notes: ''
    });
    setItems([{ id: 1, product: '', currentQuantity: '', adjustedQuantity: '', type: 'increase' }]);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', currentQuantity: '', adjustedQuantity: '', type: 'increase' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const products = [
    { value: 'product1', label: 'Laptop Computer' },
    { value: 'product2', label: 'Office Chair' },
    { value: 'product3', label: 'USB Cable' },
    { value: 'product4', label: 'Desk Lamp' }
  ];

  const locations = [
    { value: 'location1', label: 'Main Warehouse' },
    { value: 'location2', label: 'Store A' },
    { value: 'location3', label: 'Store B' }
  ];

  const reasons = [
    { value: 'damage', label: 'Damage' },
    { value: 'theft', label: 'Theft' },
    { value: 'loss', label: 'Loss' },
    { value: 'found', label: 'Found Stock' },
    { value: 'count', label: 'Physical Count' },
    { value: 'expired', label: 'Expired/Obsolete' },
    { value: 'error', label: 'Recording Error' }
  ];

  const adjustmentTypes = [
    { value: 'increase', label: 'Increase' },
    { value: 'decrease', label: 'Decrease' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Inventory Adjustment">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Adjustment Number"
              placeholder="Auto-generated"
              value={formData.adjustmentNumber}
              onChange={(e) => setFormData({ ...formData, adjustmentNumber: e.target.value })}
            />
            
            <Input
              label="Adjustment Date"
              type="date"
              value={formData.adjustmentDate}
              onChange={(e) => setFormData({ ...formData, adjustmentDate: e.target.value })}
            />
            
            <Select
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              options={locations}
              placeholder="Select location"
            />
            
            <Select
              label="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              options={reasons}
              placeholder="Select reason"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#2C2C36]">Items</h3>
              <Button type="button" onClick={addItem} variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Select
                      label="Product"
                      value={item.product}
                      onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                      options={products}
                      placeholder="Select product"
                    />
                    
                    <Input
                      label="Current Quantity"
                      type="number"
                      placeholder="Current qty"
                      value={item.currentQuantity}
                      onChange={(e) => updateItem(item.id, 'currentQuantity', e.target.value)}
                    />
                    
                    <Input
                      label="Adjusted Quantity"
                      type="number"
                      placeholder="New qty"
                      value={item.adjustedQuantity}
                      onChange={(e) => updateItem(item.id, 'adjustedQuantity', e.target.value)}
                    />
                    
                    <Select
                      label="Type"
                      value={item.type}
                      onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                      options={adjustmentTypes}
                      placeholder="Type"
                    />
                  </div>
                  
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Add any notes about this adjustment..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" className="flex-1">
              Create Adjustment
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// Main Adjustments Component with Dummy Data
export default function Adjustments() {
  const [formOpen, setFormOpen] = useState(false);

  // Dummy adjustment data
  const adjustments = [
    {
      id: 'ADJ-001',
      date: '2025-11-18',
      location: 'Main Warehouse',
      reason: 'Physical Count',
      adjustedBy: 'John Smith',
      items: [
        { product: 'Laptop Computer', currentQty: 40, adjustedQty: 38, difference: -2, type: 'decrease' },
        { product: 'USB Cable', currentQty: 200, adjustedQty: 195, difference: -5, type: 'decrease' }
      ]
    },
    {
      id: 'ADJ-002',
      date: '2025-11-19',
      location: 'Store A',
      reason: 'Damage',
      adjustedBy: 'Sarah Johnson',
      items: [
        { product: 'Office Chair', currentQty: 18, adjustedQty: 15, difference: -3, type: 'decrease' }
      ]
    },
    {
      id: 'ADJ-003',
      date: '2025-11-20',
      location: 'Store B',
      reason: 'Found Stock',
      adjustedBy: 'Mike Wilson',
      items: [
        { product: 'Desk Lamp', currentQty: 27, adjustedQty: 32, difference: +5, type: 'increase' },
        { product: 'USB Cable', currentQty: 50, adjustedQty: 58, difference: +8, type: 'increase' }
      ]
    },
    {
      id: 'ADJ-004',
      date: '2025-11-21',
      location: 'Main Warehouse',
      reason: 'Expired/Obsolete',
      adjustedBy: 'John Smith',
      items: [
        { product: 'Laptop Computer', currentQty: 38, adjustedQty: 36, difference: -2, type: 'decrease' }
      ]
    },
    {
      id: 'ADJ-005',
      date: '2025-11-22',
      location: 'Store A',
      reason: 'Recording Error',
      adjustedBy: 'Sarah Johnson',
      items: [
        { product: 'Office Chair', currentQty: 15, adjustedQty: 18, difference: +3, type: 'increase' }
      ]
    }
  ];

  const handleAdjustmentCreated = () => {
    console.log('Adjustment created successfully');
  };

  const getReasonBadgeColor = (reason) => {
    const colors = {
      'Physical Count': 'bg-blue-100 text-blue-700 border-blue-200',
      'Damage': 'bg-red-100 text-red-700 border-red-200',
      'Found Stock': 'bg-green-100 text-green-700 border-green-200',
      'Expired/Obsolete': 'bg-orange-100 text-orange-700 border-orange-200',
      'Recording Error': 'bg-purple-100 text-purple-700 border-purple-200',
      'Theft': 'bg-red-100 text-red-700 border-red-200',
      'Loss': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[reason] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Inventory Adjustments</h1>
          <p className="text-gray-600 mt-1">
            Correct stock discrepancies and record counts
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Adjustment
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Adjustment List</CardTitle>
          <CardDescription>Track all inventory corrections</CardDescription>
        </CardHeader>
        <CardContent>
          {adjustments.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#2C2C36]">No adjustments yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first adjustment to fix stock discrepancies
              </p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Adjustment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {adjustments.map((adjustment) => {
                const totalDifference = adjustment.items.reduce((sum, item) => sum + item.difference, 0);
                const isIncrease = totalDifference > 0;
                
                return (
                  <Card key={adjustment.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-[#714B67]">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#2C2C36]">{adjustment.id}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getReasonBadgeColor(adjustment.reason)}`}>
                              {adjustment.reason}
                            </span>
                            <Badge variant={isIncrease ? 'increase' : 'decrease'}>
                              {isIncrease ? (
                                <><TrendingUp className="h-3 w-3 mr-1 inline" />+{totalDifference}</>
                              ) : (
                                <><TrendingDown className="h-3 w-3 mr-1 inline" />{totalDifference}</>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(adjustment.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{adjustment.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-gray-700">Adjusted Items ({adjustment.items.length})</p>
                          <p className="text-xs text-gray-600">By: {adjustment.adjustedBy}</p>
                        </div>
                        <div className="space-y-2">
                          {adjustment.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded px-3 py-2">
                              <span className="text-[#2C2C36] font-medium">{item.product}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-gray-600">
                                  {item.currentQty} → {item.adjustedQty}
                                </span>
                                <span className={`font-semibold ${item.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {item.difference > 0 ? '+' : ''}{item.difference}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AdjustmentForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSuccess={handleAdjustmentCreated}
      />
    </div>
  );
}
