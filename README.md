# StockMaster - Inventory Management System

A comprehensive, modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. This system replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

## 🎯 Features

### Authentication
- ✅ User signup/login with JWT authentication
- ✅ OTP-based password reset (Forgot Password)
- ✅ Role-based access control (Inventory Managers, Warehouse Staff, Admin)
- ✅ Protected routes and session management

### Dashboard
- ✅ Real-time KPIs:
  - Total Products in Stock
  - Low Stock / Out of Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Internal Transfers Scheduled
- ✅ Dynamic filters by document type, status, warehouse, and category
- ✅ Recent operations view with document history

### Product Management
- ✅ Create/update products with:
  - Name, SKU/Code
  - Category
  - Unit of Measure
  - Initial stock (optional)
- ✅ Stock availability per location and warehouse
- ✅ Product categories management
- ✅ Reordering rules (reorder level and quantity)
- ✅ Low stock alerts and filtering
- ✅ Search by name or SKU

### Operations

#### 1. Receipts (Incoming Stock)
- ✅ Create receipts for incoming goods from vendors
- ✅ Add supplier and products with quantities
- ✅ Input unit prices (optional)
- ✅ Validate → stock increases automatically
- ✅ Status tracking: Draft, Waiting, Ready, Done, Canceled
- ✅ Document numbering: WH/IN/0001 format

#### 2. Delivery Orders (Outgoing Stock)
- ✅ Create delivery orders for customer shipments
- ✅ Pick items (track picked quantities)
- ✅ Pack items (track packed quantities)
- ✅ Validate → stock decreases automatically
- ✅ Status tracking: Draft, Waiting, Ready, Done, Canceled
- ✅ Document numbering: WH/OUT/0001 format

#### 3. Internal Transfers
- ✅ Move stock between warehouses/locations
- ✅ Track transfers from source to destination
- ✅ Stock is automatically updated in both locations
- ✅ Complete audit trail in stock ledger
- ✅ Document numbering: WH/MOVE/0001 format

#### 4. Stock Adjustments
- ✅ Fix mismatches between recorded and physical stock
- ✅ Select product/location/warehouse
- ✅ Enter recorded and physical quantities
- ✅ System calculates difference automatically
- ✅ Reason tracking (Damaged, Lost, Found, Counting error, Theft)
- ✅ Document numbering: WH/ADJ/0001 format

#### 5. Move History / Stock Ledger
- ✅ Complete audit trail of all stock movements
- ✅ Filter by product, warehouse, document type, transaction type, and date range
- ✅ View quantity changes and stock after each transaction
- ✅ Track who created each transaction

### Warehouse Management
- ✅ Create and manage warehouses
- ✅ Track stock by warehouse and location
- ✅ Multi-warehouse support
- ✅ Warehouse codes and addresses

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **Sequelize** ORM for database operations
- **JWT** for authentication
- **bcrypt** for password hashing
- **dotenv** for environment variables
- **cors** for cross-origin resource sharing

### Frontend
- **React** with Vite
- **React Router** for navigation
- **TailwindCSS** for modern, responsive styling
- **Context API** for state management
- **Axios** for API calls

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher, or MySQL 8.0+)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stockmaster
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

4. Create the MySQL database:
```sql
CREATE DATABASE stockmaster;
```

5. Seed the database with sample data (recommended for first run):
```bash
npm run seed
```

This will create:
- 4 users (Inventory Manager, Warehouse Staff, Admin)
- 3 warehouses (Main Warehouse, Production Stock, Distribution Center)
- 64 products across 8 categories (Furniture, Raw Materials, Electronics, Office Supplies, Tools, Packaging, Safety Equipment, Maintenance)
- 200 receipts with various statuses
- 200 delivery orders with various statuses
- 200 internal transfers
- 200 stock adjustments
- Complete stock ledger entries

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 🚀 Usage

1. **Start the backend server:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the frontend server:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

4. **Login with sample credentials:**
   - **Email:** `john.anderson@stockmaster.com`
   - **Password:** `password123`
   
   Or create a new account.

5. **Start managing your inventory!**

## 📁 Project Structure

```
StockMaster/
├── Backend/
│   ├── config/
│   │   └── database.js          # MySQL connection with Sequelize
│   ├── models/                  # Sequelize models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Warehouse.js
│   │   ├── StockLocation.js
│   │   ├── Receipt.js
│   │   ├── ReceiptItem.js
│   │   ├── DeliveryOrder.js
│   │   ├── DeliveryOrderItem.js
│   │   ├── Transfer.js
│   │   ├── TransferItem.js
│   │   ├── Adjustment.js
│   │   ├── AdjustmentItem.js
│   │   ├── StockLedger.js
│   │   └── index.js             # Model associations
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── warehouses.js
│   │   ├── receipts.js
│   │   ├── deliveryOrders.js
│   │   ├── transfers.js
│   │   ├── adjustments.js
│   │   ├── stockLedger.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── services/
│   │   └── stockService.js      # Stock update logic with transactions
│   ├── utils/
│   │   └── generateDocNumber.js # Document number generator
│   ├── scripts/
│   │   ├── seedData.js          # Database seeding script
│   │   └── ...                  # Utility scripts
│   └── server.js                # Express server setup
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx       # Main layout with sidebar
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Pagination.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Products.jsx
    │   │   ├── Warehouses.jsx
    │   │   ├── Receipts.jsx
    │   │   ├── DeliveryOrders.jsx
    │   │   ├── Transfers.jsx
    │   │   ├── Adjustments.jsx
    │   │   ├── MoveHistory.jsx
    │   │   └── Profile.jsx
    │   ├── utils/
    │   │   └── api.js           # API client utility
    │   ├── App.jsx              # Main app component with routing
    │   └── main.jsx             # Entry point
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters: category, search, warehouse, lowStock)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Deactivate product
- `GET /api/products/categories/list` - Get all categories

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/:id` - Get single warehouse
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Deactivate warehouse

### Receipts
- `GET /api/receipts` - Get all receipts (with filters: status, warehouse)
- `GET /api/receipts/:id` - Get single receipt
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id` - Update receipt
- `POST /api/receipts/:id/validate` - Validate receipt (update stock)
- `POST /api/receipts/:id/cancel` - Cancel receipt

### Delivery Orders
- `GET /api/delivery-orders` - Get all orders (with filters: status, warehouse)
- `GET /api/delivery-orders/:id` - Get single order
- `POST /api/delivery-orders` - Create order
- `PUT /api/delivery-orders/:id` - Update order
- `POST /api/delivery-orders/:id/pick` - Pick items
- `POST /api/delivery-orders/:id/pack` - Pack items
- `POST /api/delivery-orders/:id/validate` - Validate order (update stock)
- `POST /api/delivery-orders/:id/cancel` - Cancel order

### Transfers
- `GET /api/transfers` - Get all transfers (with filters: status, fromWarehouse, toWarehouse)
- `GET /api/transfers/:id` - Get single transfer
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/:id` - Update transfer
- `POST /api/transfers/:id/validate` - Validate transfer (move stock)
- `POST /api/transfers/:id/cancel` - Cancel transfer

### Adjustments
- `GET /api/adjustments` - Get all adjustments (with filters: status, warehouse)
- `GET /api/adjustments/:id` - Get single adjustment
- `POST /api/adjustments` - Create adjustment
- `PUT /api/adjustments/:id` - Update adjustment
- `POST /api/adjustments/:id/validate` - Validate adjustment (update stock)
- `POST /api/adjustments/:id/cancel` - Cancel adjustment

### Stock Ledger
- `GET /api/stock-ledger` - Get ledger entries (with filters: product, warehouse, documentType, transactionType, startDate, endDate)
- `GET /api/stock-ledger/product/:id` - Get product movement history

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/data` - Get dashboard data with filters

## 📊 Inventory Flow Example

1. **Receive Goods from Vendor**
   - Create a Receipt: Receive 100 kg Steel
   - Validate → Stock: +100
   - Stock Ledger entry created

2. **Move to Production Rack**
   - Create Internal Transfer: Main Store → Production Rack
   - Validate → Stock decreased from source, increased at destination
   - Stock Ledger entries created for both locations

3. **Deliver Finished Goods**
   - Create Delivery Order: Deliver 20 kg Steel
   - Pick items → Track picked quantities
   - Pack items → Track packed quantities
   - Validate → Stock: -20
   - Stock Ledger entry created

4. **Adjust Damaged Items**
   - Create Adjustment: Physical count shows 3 kg Steel damaged
   - Enter recorded quantity and physical quantity
   - System calculates difference: -3
   - Validate → Stock updated
   - Stock Ledger entry created

All transactions are automatically logged in the Stock Ledger with complete audit trail.

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds, smooth animations, and professional styling
- **Beautiful Cards**: KPI cards with icons and gradients
- **Responsive Tables**: Clean, modern table design with hover effects
- **Status Badges**: Color-coded status indicators (Draft, Waiting, Ready, Done, Canceled)
- **Smooth Transitions**: All interactions have smooth animations
- **Professional Layout**: Clean sidebar with collapsible menu
- **Beautiful Forms**: Modern input fields with focus states
- **Real-time Updates**: Dashboard KPIs update based on current data
- **Advanced Filtering**: Filter documents by type, status, warehouse, and date range

## 🔒 Security Notes

- Change the `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement proper CORS policies for production
- Add rate limiting for API endpoints
- Use HTTPS in production
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days

## 🧪 Testing

After seeding the database, you can test all features:

1. **Login** with sample credentials
2. **View Dashboard** - Check KPIs and recent operations
3. **Manage Products** - Create, update, and view products
4. **Create Receipt** - Add incoming stock
5. **Create Delivery Order** - Process outgoing stock
6. **Create Transfer** - Move stock between warehouses
7. **Create Adjustment** - Fix stock discrepancies
8. **View Move History** - Check complete audit trail

## 📝 Database Schema

The system uses MySQL with Sequelize ORM. Key tables include:
- `users` - User accounts with roles
- `warehouses` - Warehouse information
- `products` - Product catalog
- `stock_locations` - Stock quantities by product, warehouse, and location
- `receipts` & `receipt_items` - Incoming stock documents
- `delivery_orders` & `delivery_order_items` - Outgoing stock documents
- `transfers` & `transfer_items` - Internal stock movements
- `adjustments` & `adjustment_items` - Stock count adjustments
- `stock_ledger` - Complete audit trail of all stock movements

## 🚧 Future Enhancements

- [ ] Export reports to PDF/Excel
- [ ] Email notifications for low stock
- [ ] Barcode scanning support
- [ ] Mobile app
- [ ] Advanced analytics and reporting
- [ ] Multi-currency support
- [ ] Purchase order management
- [ ] Supplier management
- [ ] Customer management

## 📄 License

This project is part of a portfolio/demo project.

## 👥 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

**StockMaster** - Streamline your inventory management! 🎉
