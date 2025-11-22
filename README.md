# StockMaster - Inventory Management System

A comprehensive, modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. This system replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

## Features

### Authentication
- User signup/login
- OTP-based password reset
- Role-based access control (Inventory Managers, Warehouse Staff, Admin)

### Dashboard
- Real-time KPIs:
  - Total Products in Stock
  - Low Stock / Out of Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Internal Transfers Scheduled
- Dynamic filters by document type, status, warehouse, and category

### Product Management
- Create/update products with:
  - Name, SKU/Code
  - Category
  - Unit of Measure
  - Initial stock (optional)
- Stock availability per location
- Product categories management
- Reordering rules (reorder level and quantity)
- Low stock alerts

### Operations

#### 1. Receipts (Incoming Stock)
- Create receipts for incoming goods from vendors
- Add supplier and products
- Input quantities received
- Validate → stock increases automatically

#### 2. Delivery Orders (Outgoing Stock)
- Create delivery orders for customer shipments
- Pick items
- Pack items
- Validate → stock decreases automatically

#### 3. Internal Transfers
- Move stock between warehouses/locations
- Track transfers from source to destination
- Stock is logged in the ledger

#### 4. Stock Adjustments
- Fix mismatches between recorded and physical stock
- Select product/location
- Enter counted quantity
- System auto-updates and logs the adjustment

#### 5. Move History / Stock Ledger
- Complete audit trail of all stock movements
- Filter by product, warehouse, document type, transaction type, and date range
- View quantity changes and stock after each transaction

### Warehouse Management
- Create and manage warehouses
- Track stock by warehouse and location
- Multi-warehouse support

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React** with Vite
- **React Router** for navigation
- **TailwindCSS** for styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory (optional - MongoDB Atlas URL is already configured):
```env
PORT=3000
MONGODB_URI=mongodb+srv://katudigamer_db_user:RQD8a1xplNqZi6JY@cluster0.colo8i5.mongodb.net/stockmaster?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
```

4. Seed the database with sample data (optional but recommended):
```bash
npm run seed
```

5. Start the backend server:
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

3. Create a `.env` file in the Frontend directory (optional):
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Seed the database** (recommended for first run):
   ```bash
   cd Backend
   npm run seed
   ```
   This will create sample users, warehouses, products, receipts, delivery orders, transfers, and adjustments with realistic data.

2. Start the backend server:
   ```bash
   cd Backend
   npm run dev
   ```

3. Start the frontend server:
   ```bash
   cd Frontend
   npm run dev
   ```

4. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)

5. Login with sample credentials:
   - **Email:** `john.anderson@stockmaster.com`
   - **Password:** `password123`
   
   Or create a new account.

6. Start managing your inventory!

## Project Structure

```
StockMaster/
├── Backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/                  # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Warehouse.js
│   │   ├── Receipt.js
│   │   ├── DeliveryOrder.js
│   │   ├── Transfer.js
│   │   ├── Adjustment.js
│   │   └── StockLedger.js
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
│   │   └── stockService.js      # Stock update logic
│   ├── utils/
│   │   └── generateDocNumber.js # Document number generator
│   └── server.js                # Express server setup
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx       # Main layout with sidebar
    │   │   └── ProtectedRoute.jsx
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

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
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
- `GET /api/receipts` - Get all receipts (with filters)
- `GET /api/receipts/:id` - Get single receipt
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id` - Update receipt
- `POST /api/receipts/:id/validate` - Validate receipt (update stock)
- `POST /api/receipts/:id/cancel` - Cancel receipt

### Delivery Orders
- `GET /api/delivery-orders` - Get all orders (with filters)
- `GET /api/delivery-orders/:id` - Get single order
- `POST /api/delivery-orders` - Create order
- `PUT /api/delivery-orders/:id` - Update order
- `POST /api/delivery-orders/:id/pick` - Pick items
- `POST /api/delivery-orders/:id/pack` - Pack items
- `POST /api/delivery-orders/:id/validate` - Validate order (update stock)
- `POST /api/delivery-orders/:id/cancel` - Cancel order

### Transfers
- `GET /api/transfers` - Get all transfers (with filters)
- `GET /api/transfers/:id` - Get single transfer
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/:id` - Update transfer
- `POST /api/transfers/:id/validate` - Validate transfer (move stock)
- `POST /api/transfers/:id/cancel` - Cancel transfer

### Adjustments
- `GET /api/adjustments` - Get all adjustments (with filters)
- `GET /api/adjustments/:id` - Get single adjustment
- `POST /api/adjustments` - Create adjustment
- `PUT /api/adjustments/:id` - Update adjustment
- `POST /api/adjustments/:id/validate` - Validate adjustment (update stock)
- `POST /api/adjustments/:id/cancel` - Cancel adjustment

### Stock Ledger
- `GET /api/stock-ledger` - Get ledger entries (with filters)
- `GET /api/stock-ledger/product/:id` - Get product movement history

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/data` - Get dashboard data with filters

## Inventory Flow Example

1. **Receive Goods from Vendor**
   - Create a Receipt: Receive 100 kg Steel
   - Validate → Stock: +100

2. **Move to Production Rack**
   - Create Internal Transfer: Main Store → Production Rack
   - Validate → Stock unchanged in total, but new location updated

3. **Deliver Finished Goods**
   - Create Delivery Order: Deliver 20 kg Steel
   - Validate → Stock: -20

4. **Adjust Damaged Items**
   - Create Adjustment: 3 kg Steel damaged
   - Enter physical quantity → Stock: -3
   - Everything logged in the Stock Ledger

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement proper CORS policies for production
- Add rate limiting for API endpoints
- Use HTTPS in production

## License

This project is part of a portfolio/demo project.

