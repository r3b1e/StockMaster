import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  ArrowLeftRight,
  TrendingUp
} from 'lucide-react';

// StatCard Component
const StatCard = ({ title, value, icon: Icon, description, variant = 'default' }) => {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-[#714B67]/10 to-[#714B67]/5 border-[#714B67]/20',
    warning: 'bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20',
    default: 'bg-white border-gray-200'
  };

  const iconStyles = {
    primary: 'bg-[#714B67]/20 text-[#714B67]',
    warning: 'bg-yellow-500/20 text-yellow-500',
    default: 'bg-[#714B67]/20 text-[#714B67]'
  };

  return (
    <div className={`rounded-lg border p-6 shadow-sm ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-[#2C2C36]">{value}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-[#2C2C36]">{children}</h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const [stats] = useState({
    totalProducts: 156,
    lowStockItems: 12,
    pendingReceipts: 8,
    pendingDeliveries: 5,
    pendingTransfers: 3,
  });

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your inventory operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description="Active products in stock"
          variant="primary"
        />
        
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          description="Below reorder level"
          variant={stats.lowStockItems > 0 ? 'warning' : 'default'}
        />
        
        <StatCard
          title="Pending Receipts"
          value={stats.pendingReceipts}
          icon={ArrowDownToLine}
          description="Incoming shipments"
          variant="default"
        />
        
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={ArrowUpFromLine}
          description="Outgoing shipments"
          variant="default"
        />
        
        <StatCard
          title="Pending Transfers"
          value={stats.pendingTransfers}
          icon={ArrowLeftRight}
          description="Internal movements"
          variant="default"
        />

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">Operational</h3>
                <p className="text-xs text-gray-500 mt-1">All systems running</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center py-8">
              No recent activity to display
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <a 
              href="/products" 
              className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <Package className="h-4 w-4 text-[#714B67]" />
              <span className="text-sm font-medium text-[#2C2C36]">Add New Product</span>
            </a>
            <a 
              href="/receipts" 
              className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowDownToLine className="h-4 w-4 text-[#714B67]" />
              <span className="text-sm font-medium text-[#2C2C36]">Create Receipt</span>
            </a>
            <a 
              href="/deliveries" 
              className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowUpFromLine className="h-4 w-4 text-[#714B67]" />
              <span className="text-sm font-medium text-[#2C2C36]">Create Delivery</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
