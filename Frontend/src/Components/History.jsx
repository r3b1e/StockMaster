import { useState } from 'react';
import { History as HistoryIcon, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, ClipboardList, Calendar, MapPin, Package, Filter } from 'lucide-react';

// Badge Component
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    receipt: 'bg-blue-100 text-blue-700 border-blue-200',
    delivery: 'bg-purple-100 text-purple-700 border-purple-200',
    transfer: 'bg-orange-100 text-orange-700 border-orange-200',
    adjustment: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Select Component
const Select = ({ value, onChange, options, placeholder, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent bg-white text-sm ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
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

// Main History Component with Dummy Data
export default function History() {
  const [filterType, setFilterType] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Comprehensive dummy stock movement history data
  const stockMovements = [
    {
      id: 'SM-001',
      date: '2025-11-22',
      time: '14:30',
      type: 'receipt',
      reference: 'RCP-001',
      product: 'Laptop Computer',
      location: 'Main Warehouse',
      quantityIn: 10,
      quantityOut: 0,
      balance: 48,
      user: 'John Smith',
      notes: 'From ABC Suppliers Ltd.'
    },
    {
      id: 'SM-002',
      date: '2025-11-22',
      time: '13:15',
      type: 'delivery',
      reference: 'DEL-005',
      product: 'Office Chair',
      location: 'Store A',
      quantityIn: 0,
      quantityOut: 5,
      balance: 13,
      user: 'Sarah Johnson',
      notes: 'Customer order #1234'
    },
    {
      id: 'SM-003',
      date: '2025-11-22',
      time: '11:45',
      type: 'transfer',
      reference: 'TRF-003',
      product: 'USB Cable',
      location: 'Main Warehouse → Store B',
      quantityIn: 0,
      quantityOut: 30,
      balance: 165,
      user: 'Mike Wilson',
      notes: 'Stock replenishment'
    },
    {
      id: 'SM-004',
      date: '2025-11-22',
      time: '10:20',
      type: 'adjustment',
      reference: 'ADJ-005',
      product: 'Office Chair',
      location: 'Store A',
      quantityIn: 3,
      quantityOut: 0,
      balance: 18,
      user: 'Sarah Johnson',
      notes: 'Recording Error correction'
    },
    {
      id: 'SM-005',
      date: '2025-11-21',
      time: '16:50',
      type: 'receipt',
      reference: 'RCP-002',
      product: 'Desk Lamp',
      location: 'Main Warehouse',
      quantityIn: 25,
      quantityOut: 0,
      balance: 57,
      user: 'John Smith',
      notes: 'From XYZ Trading Co.'
    },
    {
      id: 'SM-006',
      date: '2025-11-21',
      time: '15:30',
      type: 'delivery',
      reference: 'DEL-004',
      product: 'Laptop Computer',
      location: 'Main Warehouse',
      quantityIn: 0,
      quantityOut: 8,
      balance: 38,
      user: 'John Smith',
      notes: 'Corporate bulk order'
    },
    {
      id: 'SM-007',
      date: '2025-11-21',
      time: '14:15',
      type: 'adjustment',
      reference: 'ADJ-004',
      product: 'Laptop Computer',
      location: 'Main Warehouse',
      quantityIn: 0,
      quantityOut: 2,
      balance: 46,
      user: 'John Smith',
      notes: 'Expired/Obsolete - warranty claims'
    },
    {
      id: 'SM-008',
      date: '2025-11-21',
      time: '12:00',
      type: 'transfer',
      reference: 'TRF-002',
      product: 'Office Chair',
      location: 'Store A → Distribution Center',
      quantityIn: 0,
      quantityOut: 10,
      balance: 15,
      user: 'Sarah Johnson',
      notes: 'Redistribution'
    },
    {
      id: 'SM-009',
      date: '2025-11-20',
      time: '16:20',
      type: 'adjustment',
      reference: 'ADJ-003',
      product: 'USB Cable',
      location: 'Store B',
      quantityIn: 8,
      quantityOut: 0,
      balance: 58,
      user: 'Mike Wilson',
      notes: 'Found Stock during inventory count'
    },
    {
      id: 'SM-010',
      date: '2025-11-20',
      time: '14:45',
      type: 'transfer',
      reference: 'TRF-001',
      product: 'Laptop Computer',
      location: 'Main Warehouse → Store A',
      quantityIn: 0,
      quantityOut: 5,
      balance: 48,
      user: 'John Smith',
      notes: 'Store restocking'
    },
    {
      id: 'SM-011',
      date: '2025-11-20',
      time: '11:30',
      type: 'receipt',
      reference: 'RCP-003',
      product: 'USB Cable',
      location: 'Main Warehouse',
      quantityIn: 100,
      quantityOut: 0,
      balance: 195,
      user: 'John Smith',
      notes: 'Monthly bulk order'
    },
    {
      id: 'SM-012',
      date: '2025-11-19',
      time: '15:00',
      type: 'delivery',
      reference: 'DEL-003',
      product: 'Desk Lamp',
      location: 'Store B',
      quantityIn: 0,
      quantityOut: 8,
      balance: 19,
      user: 'Mike Wilson',
      notes: 'Retail customer order'
    },
    {
      id: 'SM-013',
      date: '2025-11-19',
      time: '13:30',
      type: 'adjustment',
      reference: 'ADJ-002',
      product: 'Office Chair',
      location: 'Store A',
      quantityIn: 0,
      quantityOut: 3,
      balance: 25,
      user: 'Sarah Johnson',
      notes: 'Damage - floor display'
    },
    {
      id: 'SM-014',
      date: '2025-11-19',
      time: '10:15',
      type: 'delivery',
      reference: 'DEL-002',
      product: 'USB Cable',
      location: 'Main Warehouse',
      quantityIn: 0,
      quantityOut: 50,
      balance: 95,
      user: 'John Smith',
      notes: 'Wholesale order'
    },
    {
      id: 'SM-015',
      date: '2025-11-18',
      time: '16:40',
      type: 'adjustment',
      reference: 'ADJ-001',
      product: 'Laptop Computer',
      location: 'Main Warehouse',
      quantityIn: 0,
      quantityOut: 2,
      balance: 53,
      user: 'John Smith',
      notes: 'Physical Count discrepancy'
    }
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'receipt': return <ArrowDownToLine className="h-4 w-4" />;
      case 'delivery': return <ArrowUpFromLine className="h-4 w-4" />;
      case 'transfer': return <ArrowLeftRight className="h-4 w-4" />;
      case 'adjustment': return <ClipboardList className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      receipt: 'Receipt',
      delivery: 'Delivery',
      transfer: 'Transfer',
      adjustment: 'Adjustment'
    };
    return labels[type] || type;
  };

  // Filter movements
  const filteredMovements = stockMovements.filter(movement => {
    if (filterType && movement.type !== filterType) return false;
    if (filterProduct && movement.product !== filterProduct) return false;
    if (filterLocation && !movement.location.includes(filterLocation)) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueProducts = [...new Set(stockMovements.map(m => m.product))];
  const uniqueLocations = [...new Set(stockMovements.flatMap(m => 
    m.location.includes('→') ? m.location.split(' → ') : [m.location]
  ))];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Stock History</h1>
        <p className="text-gray-600 mt-1">
          Complete ledger of all stock movements
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stock Movement Ledger</CardTitle>
              <CardDescription>Track every change in inventory</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'receipt', label: 'Receipts' },
                { value: 'delivery', label: 'Deliveries' },
                { value: 'transfer', label: 'Transfers' },
                { value: 'adjustment', label: 'Adjustments' }
              ]}
              placeholder="All Transaction Types"
            />
            
            <Select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              options={uniqueProducts.map(p => ({ value: p, label: p }))}
              placeholder="All Products"
            />
            
            <Select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              options={uniqueLocations.map(l => ({ value: l, label: l }))}
              placeholder="All Locations"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredMovements.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#2C2C36]">No stock movements found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or clear them to see all movements
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700">
                <div className="col-span-2">Date & Time</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Product</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-1 text-right">In</div>
                <div className="col-span-1 text-right">Out</div>
                <div className="col-span-1 text-right">Balance</div>
                <div className="col-span-1">User</div>
              </div>

              {/* Table Rows */}
              {filteredMovements.map((movement) => (
                <Card key={movement.id} className="hover:shadow-md transition-all duration-200">
                  <div className="p-4">
                    {/* Mobile & Desktop Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center">
                      {/* Date & Time */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 md:hidden" />
                          <div>
                            <p className="font-medium text-[#2C2C36]">
                              {new Date(movement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500">{movement.time}</p>
                          </div>
                        </div>
                      </div>

                      {/* Type */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={movement.type}>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(movement.type)}
                              {getTypeLabel(movement.type)}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{movement.reference}</p>
                      </div>

                      {/* Product */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500 md:hidden" />
                          <p className="text-sm font-medium text-[#2C2C36]">{movement.product}</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 md:hidden" />
                          <p className="text-sm text-gray-600">{movement.location}</p>
                        </div>
                      </div>

                      {/* Quantity In */}
                      <div className="col-span-1 md:col-span-1 md:text-right">
                        <span className="md:hidden text-xs text-gray-500">In: </span>
                        <span className={`text-sm font-semibold ${movement.quantityIn > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {movement.quantityIn > 0 ? `+${movement.quantityIn}` : '—'}
                        </span>
                      </div>

                      {/* Quantity Out */}
                      <div className="col-span-1 md:col-span-1 md:text-right">
                        <span className="md:hidden text-xs text-gray-500">Out: </span>
                        <span className={`text-sm font-semibold ${movement.quantityOut > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {movement.quantityOut > 0 ? `-${movement.quantityOut}` : '—'}
                        </span>
                      </div>

                      {/* Balance */}
                      <div className="col-span-1 md:col-span-1 md:text-right">
                        <span className="md:hidden text-xs text-gray-500">Balance: </span>
                        <span className="text-sm font-bold text-[#714B67]">{movement.balance}</span>
                      </div>

                      {/* User */}
                      <div className="col-span-1 md:col-span-1">
                        <p className="text-xs text-gray-600">{movement.user}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {movement.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 italic">{movement.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {filteredMovements.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Total Movements</p>
                  <p className="text-2xl font-bold text-[#2C2C36]">{filteredMovements.length}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600">Total In</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{filteredMovements.reduce((sum, m) => sum + m.quantityIn, 0)}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600">Total Out</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{filteredMovements.reduce((sum, m) => sum + m.quantityOut, 0)}
                  </p>
                </div>
                <div className="text-center p-3 bg-[#714B67]/10 rounded-lg">
                  <p className="text-xs text-gray-600">Net Change</p>
                  <p className="text-2xl font-bold text-[#714B67]">
                    {filteredMovements.reduce((sum, m) => sum + m.quantityIn - m.quantityOut, 0)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
