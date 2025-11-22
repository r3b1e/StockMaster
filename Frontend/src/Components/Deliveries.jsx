import { useState } from 'react';
import { Plus, ArrowUpFromLine, X, Calendar, MapPin, Package, User, Truck } from 'lucide-react';

// Badge Component
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    waiting: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ready: 'bg-blue-100 text-blue-700 border-blue-200',
    'in-transit': 'bg-purple-100 text-purple-700 border-purple-200',
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

// Delivery Form Component
const DeliveryForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer: '',
    orderNumber: '',
    deliveryDate: '',
    deliveryAddress: '',
    status: 'draft',
    notes: ''
  });

  const [items, setItems] = useState([
    { id: 1, product: '', quantity: '', location: '' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Delivery data:', { ...formData, items });
    onSuccess();
    onClose();
    setFormData({
      customer: '',
      orderNumber: '',
      deliveryDate: '',
      deliveryAddress: '',
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

  const customers = [
    { value: 'customer1', label: 'Tech Solutions Inc.' },
    { value: 'customer2', label: 'Global Retail Co.' },
    { value: 'customer3', label: 'Office Supplies Ltd.' }
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
    { value: 'in-transit', label: 'In Transit' },
    { value: 'done', label: 'Delivered' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Delivery">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              options={customers}
              placeholder="Select customer"
            />
            
            <Input
              label="Order Number"
              placeholder="Enter order number"
              value={formData.orderNumber}
              onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
            />
            
            <Input
              label="Delivery Date"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statuses}
              placeholder="Select status"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea
              placeholder="Enter complete delivery address..."
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
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
                      label="From Location"
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
              placeholder="Add any delivery instructions or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" className="flex-1">
              Create Delivery
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

// Main Deliveries Component with Dummy Data
export default function Deliveries() {
  const [formOpen, setFormOpen] = useState(false);

  // Dummy deliveries data
  const deliveries = [
    {
      id: 'DEL-001',
      orderNumber: 'ORD-2025-3456',
      customer: 'Tech Solutions Inc.',
      deliveryDate: '2025-11-22',
      dispatchedDate: '2025-11-22',
      status: 'done',
      trackingNumber: 'TRK-8745210',
      deliveryAddress: '123 Tech Park, Sector 5, Bangalore, Karnataka - 560001',
      createdBy: 'Sarah Johnson',
      items: [
        { product: 'Laptop Computer', quantity: 8, location: 'Main Warehouse' }
      ],
      notes: 'Delivered successfully. Signed by: Rajesh Kumar'
    },
    {
      id: 'DEL-002',
      orderNumber: 'ORD-2025-3457',
      customer: 'Global Retail Co.',
      deliveryDate: '2025-11-23',
      dispatchedDate: '2025-11-22',
      status: 'in-transit',
      trackingNumber: 'TRK-8745211',
      deliveryAddress: '45 Mall Road, Connaught Place, New Delhi - 110001',
      createdBy: 'John Smith',
      items: [
        { product: 'Office Chair', quantity: 5, location: 'Store A' },
        { product: 'Desk Lamp', quantity: 10, location: 'Store A' }
      ],
      notes: 'Out for delivery - Expected arrival by 4:00 PM'
    },
    {
      id: 'DEL-003',
      orderNumber: 'ORD-2025-3458',
      customer: 'Office Supplies Ltd.',
      deliveryDate: '2025-11-24',
      dispatchedDate: null,
      status: 'ready',
      trackingNumber: 'TRK-8745212',
      deliveryAddress: '78 Business District, Whitefield, Bangalore - 560066',
      createdBy: 'Sarah Johnson',
      items: [
        { product: 'USB Cable', quantity: 50, location: 'Main Warehouse' },
        { product: 'Laptop Computer', quantity: 3, location: 'Main Warehouse' }
      ],
      notes: 'Ready for pickup - Courier scheduled for tomorrow'
    },
    {
      id: 'DEL-004',
      orderNumber: 'ORD-2025-3459',
      customer: 'Tech Solutions Inc.',
      deliveryDate: '2025-11-25',
      dispatchedDate: null,
      status: 'waiting',
      trackingNumber: null,
      deliveryAddress: '123 Tech Park, Sector 5, Bangalore, Karnataka - 560001',
      createdBy: 'Mike Wilson',
      items: [
        { product: 'Office Chair', quantity: 15, location: 'Distribution Center' }
      ],
      notes: 'Awaiting stock allocation from distribution center'
    },
    {
      id: 'DEL-005',
      orderNumber: 'ORD-2025-3460',
      customer: 'Global Retail Co.',
      deliveryDate: '2025-11-26',
      dispatchedDate: null,
      status: 'draft',
      trackingNumber: null,
      deliveryAddress: '45 Mall Road, Connaught Place, New Delhi - 110001',
      createdBy: 'John Smith',
      items: [
        { product: 'Desk Lamp', quantity: 25, location: 'Store B' },
        { product: 'USB Cable', quantity: 100, location: 'Main Warehouse' }
      ],
      notes: 'Draft order - pending customer confirmation'
    },
    {
      id: 'DEL-006',
      orderNumber: 'ORD-2025-3455',
      customer: 'Office Supplies Ltd.',
      deliveryDate: '2025-11-21',
      dispatchedDate: '2025-11-21',
      status: 'done',
      trackingNumber: 'TRK-8745209',
      deliveryAddress: '78 Business District, Whitefield, Bangalore - 560066',
      createdBy: 'Sarah Johnson',
      items: [
        { product: 'Laptop Computer', quantity: 12, location: 'Main Warehouse' },
        { product: 'Office Chair', quantity: 8, location: 'Store A' }
      ],
      notes: 'Bulk corporate order delivered on time'
    }
  ];

  const handleDeliveryCreated = () => {
    console.log('Delivery created successfully');
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      waiting: 'Waiting',
      ready: 'Ready',
      'in-transit': 'In Transit',
      done: 'Delivered'
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
          <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Deliveries</h1>
          <p className="text-gray-600 mt-1">
            Manage outgoing stock to customers
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Delivery
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Delivery List</CardTitle>
          <CardDescription>Track all outgoing shipments</CardDescription>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <div className="text-center py-12">
              <ArrowUpFromLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#2C2C36]">No deliveries yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first delivery order to start shipping stock
              </p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Delivery
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-[#714B67]">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#2C2C36]">{delivery.id}</h3>
                          <Badge variant={delivery.status}>
                            {getStatusLabel(delivery.status)}
                          </Badge>
                          {delivery.trackingNumber && (
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              {delivery.trackingNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Order: <span className="font-medium">{delivery.orderNumber}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Customer:</span>
                          <span className="font-medium text-[#2C2C36]">{delivery.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Delivery Date:</span>
                          <span className="font-medium text-[#2C2C36]">
                            {new Date(delivery.deliveryDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {delivery.dispatchedDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-600">Dispatched:</span>
                            <span className="font-medium text-purple-600">
                              {new Date(delivery.dispatchedDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-600">Address:</span>
                            <p className="font-medium text-[#2C2C36] text-xs mt-1 leading-relaxed">
                              {delivery.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Items ({delivery.items.length}) • Total Qty: {getTotalQuantity(delivery.items)}
                        </p>
                        <p className="text-xs text-gray-600">By: {delivery.createdBy}</p>
                      </div>
                      <div className="space-y-2">
                        {delivery.items.map((item, index) => (
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

                    {delivery.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600 italic">{delivery.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeliveryForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSuccess={handleDeliveryCreated}
      />
    </div>
  );
}
