import { useState } from 'react';
import { Plus, Package, Search, X } from 'lucide-react';

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
const Input = ({ placeholder, value, onChange, className = '', type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent ${className}`}
  />
);

// Badge Component
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    destructive: 'bg-red-100 text-red-700 border-red-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-[#2C2C36] ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitOfMeasure: '',
    reorderLevel: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product data:', formData);
    onSuccess();
    onClose();
    setFormData({
      name: '',
      sku: '',
      category: '',
      unitOfMeasure: '',
      reorderLevel: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#2C2C36] mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <Input
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <Input
              placeholder="Enter SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Input
              placeholder="Enter category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
            <Input
              placeholder="e.g., pcs, kg, L"
              value={formData.unitOfMeasure}
              onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
            <Input
              placeholder="Enter reorder level"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Product
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// Main Products Component
export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  
  const [products] = useState([
    {
      id: '1',
      name: 'Laptop Computer',
      sku: 'LAP-001',
      unit_of_measure: 'pcs',
      reorder_level: 10,
      is_active: true,
      product_categories: { name: 'Electronics' },
      stock_locations: [{ quantity: 25 }, { quantity: 15 }]
    },
    {
      id: '2',
      name: 'Office Chair',
      sku: 'CHR-002',
      unit_of_measure: 'pcs',
      reorder_level: 15,
      is_active: true,
      product_categories: { name: 'Furniture' },
      stock_locations: [{ quantity: 8 }]
    },
    {
      id: '3',
      name: 'USB Cable',
      sku: 'CAB-003',
      unit_of_measure: 'pcs',
      reorder_level: 50,
      is_active: true,
      product_categories: { name: 'Accessories' },
      stock_locations: [{ quantity: 120 }, { quantity: 80 }]
    },
    {
      id: '4',
      name: 'Desk Lamp',
      sku: 'LMP-004',
      unit_of_measure: 'pcs',
      reorder_level: 20,
      is_active: true,
      product_categories: null,
      stock_locations: [{ quantity: 12 }]
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalStock = (product) => {
    return product.stock_locations.reduce((sum, loc) => sum + Number(loc.quantity), 0);
  };

  const handleProductAdded = () => {
    console.log('Product added successfully');
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#2C2C36]">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first product'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const totalStock = getTotalStock(product);
                const isLowStock = totalStock <= product.reorder_level;

                return (
                  <Card key={product.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            SKU: {product.sku}
                          </CardDescription>
                        </div>
                        {isLowStock && (
                          <Badge variant="destructive">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-[#2C2C36]">
                            {product.product_categories?.name || 'Uncategorized'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Stock:</span>
                          <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-[#2C2C36]'}`}>
                            {totalStock} {product.unit_of_measure}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reorder Level:</span>
                          <span className="font-medium text-[#2C2C36]">{product.reorder_level}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ProductForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSuccess={handleProductAdded}
      />
    </div>
  );
}
