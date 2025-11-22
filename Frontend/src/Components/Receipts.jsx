import { useState } from 'react';
import { Plus, ArrowDownToLine, X, Calendar, MapPin, Package, User } from 'lucide-react';

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

// Receipt Form Component
const ReceiptForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    referenceNumber: '',
    expectedDate: '',
    status: 'draft',
    notes: ''
  });

  const [items, setItems] = useState([
    { id: 1, product: '', quantity: '', location: '' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Receipt data:', { ...formData, items });
    onSuccess();
    onClose();
    setFormData({
      supplier: '',
      referenceNumber: '',
      expectedDate: '',
      status: 'draft',
      notes: ''
    });
    setItems([{ id: 1, product: '', quantity: '', location: '' }]);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: '', location: '' }]);
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

  const suppliers = [
    { value: 'supplier1', label: 'ABC Suppliers Ltd.' },
    { value: 'supplier2', label: 'XYZ Trading Co.' },
    { value: 'supplier3', label: 'Global Imports Inc.' }
  ];

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

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'ready', label: 'Ready' },
    { value: 'done', label: 'Done' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Receipt">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              options={suppliers}
              placeholder="Select supplier"
            />
            
            <Input
              label="Reference Number"
              placeholder="Enter reference number"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
            />
            
            <Input
              label="Expected Date"
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    
                    <Select
                      label="Location"
                      value={item.location}
                      onChange={(e) => updateItem(item.id, 'location', e.target.value)}
                      options={locations}
                      placeholder="Select location"
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
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" className="flex-1">
              Create Receipt
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

// Main Receipts Component with Dummy Data
export default function Receipts() {
  const [formOpen, setFormOpen] = useState(false);

  // Dummy receipts data
  const receipts = [
    {
      id: 'RCP-001',
      referenceNumber: 'PO-2025-1145',
      supplier: 'ABC Suppliers Ltd.',
      expectedDate: '2025-11-25',
      receivedDate: '2025-11-22',
      status: 'done',
      createdBy: 'John Smith',
      items: [
        { product: 'Laptop Computer', quantity: 10, location: 'Main Warehouse' },
        { product: 'USB Cable', quantity: 50, location: 'Main Warehouse' }
      ],
      notes: 'Arrived on time, all items in good condition'
    },
    {
      id: 'RCP-002',
      referenceNumber: 'PO-2025-1156',
      supplier: 'XYZ Trading Co.',
      expectedDate: '2025-11-24',
      receivedDate: '2025-11-21',
      status: 'done',
      createdBy: 'John Smith',
      items: [
        { product: 'Desk Lamp', quantity: 25, location: 'Main Warehouse' }
      ],
      notes: 'Monthly bulk order received'
    },
    {
      id: 'RCP-003',
      referenceNumber: 'PO-2025-1167',
      supplier: 'ABC Suppliers Ltd.',
      expectedDate: '2025-11-23',
      receivedDate: '2025-11-20',
      status: 'done',
      createdBy: 'John Smith',
      items: [
        { product: 'USB Cable', quantity: 100, location: 'Main Warehouse' },
        { product: 'Office Chair', quantity: 15, location: 'Store A' }
      ],
      notes: 'Stock replenishment for holiday season'
    },
    {
      id: 'RCP-004',
      referenceNumber: 'PO-2025-1178',
      supplier: 'Global Imports Inc.',
      expectedDate: '2025-11-26',
      receivedDate: null,
      status: 'ready',
      createdBy: 'Sarah Johnson',
      items: [
        { product: 'Laptop Computer', quantity: 20, location: 'Main Warehouse' }
      ],
      notes: 'Ready for receiving - shipment in transit'
    },
    {
      id: 'RCP-005',
      referenceNumber: 'PO-2025-1189',
      supplier: 'XYZ Trading Co.',
      expectedDate: '2025-11-28',
      receivedDate: null,
      status: 'waiting',
      createdBy: 'John Smith',
      items: [
        { product: 'Office Chair', quantity: 30, location: 'Distribution Center' },
        { product: 'Desk Lamp', quantity: 40, location: 'Store B' }
      ],
      notes: 'Awaiting supplier confirmation'
    },
    {
      id: 'RCP-006',
      referenceNumber: 'PO-2025-1190',
      supplier: 'ABC Suppliers Ltd.',
      expectedDate: '2025-12-01',
      receivedDate: null,
      status: 'draft',
      createdBy: 'Sarah Johnson',
      items: [
        { product: 'USB Cable', quantity: 200, location: 'Main Warehouse' }
      ],
      notes: 'Draft - pending approval'
    }
  ];

  const handleReceiptCreated = () => {
    console.log('Receipt created successfully');
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      waiting: 'Waiting',
      ready: 'Ready',
      done: 'Received'
    };
    return labels[status] || status;
  };

  const getTotalQuantity = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Receipts</h1>
          <p className="text-gray-600 mt-1">
            Manage incoming stock from suppliers
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Receipt
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Receipt List</CardTitle>
          <CardDescription>Track all incoming shipments</CardDescription>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <div className="text-center py-12">
              <ArrowDownToLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#2C2C36]">No receipts yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first receipt to start tracking incoming stock
              </p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Receipt
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {receipts.map((receipt) => (
                <Card key={receipt.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-[#714B67]">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#2C2C36]">{receipt.id}</h3>
                          <Badge variant={receipt.status}>
                            {getStatusLabel(receipt.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Ref: <span className="font-medium">{receipt.referenceNumber}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-medium text-[#2C2C36]">{receipt.supplier}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Expected:</span>
                          <span className="font-medium text-[#2C2C36]">
                            {new Date(receipt.expectedDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {receipt.receivedDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">Received:</span>
                            <span className="font-medium text-green-600">
                              {new Date(receipt.receivedDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Created by:</span>
                          <span className="font-medium text-[#2C2C36]">{receipt.createdBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Items ({receipt.items.length}) • Total Qty: {getTotalQuantity(receipt.items)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {receipt.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-[#2C2C36] font-medium">{item.product}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{item.location}</span>
                              </div>
                              <span className="font-semibold text-[#714B67]">{item.quantity} pcs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {receipt.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600 italic">{receipt.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ReceiptForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSuccess={handleReceiptCreated}
      />
    </div>
  );
}
