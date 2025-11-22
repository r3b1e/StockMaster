import { useState } from 'react';
import { Plus, ArrowLeftRight, X, Calendar, MapPin } from 'lucide-react';

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
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    waiting: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ready: 'bg-blue-100 text-blue-700 border-blue-200',
    done: 'bg-green-100 text-green-700 border-green-200',
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

// Transfer Form Component
const TransferForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    transferNumber: '',
    transferDate: '',
    fromLocation: '',
    toLocation: '',
    status: 'draft',
    notes: ''
  });

  const [items, setItems] = useState([
    { id: 1, product: '', quantity: '' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Transfer data:', { ...formData, items });
    onSuccess();
    onClose();
    setFormData({
      transferNumber: '',
      transferDate: '',
      fromLocation: '',
      toLocation: '',
      status: 'draft',
      notes: ''
    });
    setItems([{ id: 1, product: '', quantity: '' }]);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: '' }]);
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
    { value: 'location3', label: 'Store B' },
    { value: 'location4', label: 'Distribution Center' }
  ];

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'ready', label: 'Ready' },
    { value: 'done', label: 'Done' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Transfer">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Transfer Number"
              placeholder="Auto-generated"
              value={formData.transferNumber}
              onChange={(e) => setFormData({ ...formData, transferNumber: e.target.value })}
            />
            
            <Input
              label="Transfer Date"
              type="date"
              value={formData.transferDate}
              onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
            />
            
            <Select
              label="From Location"
              value={formData.fromLocation}
              onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
              options={locations}
              placeholder="Select source location"
            />
            
            <Select
              label="To Location"
              value={formData.toLocation}
              onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
              options={locations}
              placeholder="Select destination location"
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statuses}
              placeholder="Select status"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select
                      label="Product"
                      value={item.product}
                      onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                      options={products}
                      placeholder="Select product"
                    />
                    
                    <Input
                      label="Quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
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
              placeholder="Add any transfer notes or instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" className="flex-1">
              Create Transfer
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

// Main Transfers Component with Dummy Data
export default function Transfers() {
  const [formOpen, setFormOpen] = useState(false);

  // Dummy transfer data
  const transfers = [
    {
      id: 'TRF-001',
      fromLocation: 'Main Warehouse',
      toLocation: 'Store A',
      date: '2025-11-20',
      status: 'done',
      items: [
        { product: 'Laptop Computer', quantity: 5 },
        { product: 'USB Cable', quantity: 20 }
      ]
    },
    {
      id: 'TRF-002',
      fromLocation: 'Store A',
      toLocation: 'Distribution Center',
      date: '2025-11-21',
      status: 'ready',
      items: [
        { product: 'Office Chair', quantity: 10 }
      ]
    },
    {
      id: 'TRF-003',
      fromLocation: 'Main Warehouse',
      toLocation: 'Store B',
      date: '2025-11-22',
      status: 'waiting',
      items: [
        { product: 'Desk Lamp', quantity: 15 },
        { product: 'USB Cable', quantity: 30 }
      ]
    },
    {
      id: 'TRF-004',
      fromLocation: 'Distribution Center',
      toLocation: 'Main Warehouse',
      date: '2025-11-23',
      status: 'draft',
      items: [
        { product: 'Laptop Computer', quantity: 3 }
      ]
    }
  ];

  const handleTransferCreated = () => {
    console.log('Transfer created successfully');
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      waiting: 'Waiting',
      ready: 'Ready',
      done: 'Completed'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Internal Transfers</h1>
          <p className="text-gray-600 mt-1">
            Move stock between warehouses and locations
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Transfer List</CardTitle>
          <CardDescription>Track all internal stock movements</CardDescription>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#2C2C36]">No transfers yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first transfer to move stock between locations
              </p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Transfer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <Card key={transfer.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-[#714B67]">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#2C2C36]">{transfer.id}</h3>
                          <Badge variant={transfer.status}>
                            {getStatusLabel(transfer.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(transfer.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">From</p>
                            <p className="text-sm text-[#2C2C36] font-semibold">{transfer.fromLocation}</p>
                          </div>
                        </div>
                        
                        <ArrowLeftRight className="h-5 w-5 text-[#714B67]" />
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">To</p>
                            <p className="text-sm text-[#2C2C36] font-semibold">{transfer.toLocation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Items ({transfer.items.length})</p>
                      <div className="space-y-2">
                        {transfer.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded px-3 py-2">
                            <span className="text-[#2C2C36]">{item.product}</span>
                            <span className="font-semibold text-[#714B67]">{item.quantity} pcs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TransferForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSuccess={handleTransferCreated}
      />
    </div>
  );
}
