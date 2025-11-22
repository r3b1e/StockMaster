# MySQL Migration Guide

I've converted the StockMaster application from MongoDB to MySQL using Sequelize. Here's what has been completed and what needs to be done:

## ✅ Completed

1. **Database Configuration**
   - Updated `Backend/config/database.js` to use Sequelize with MySQL
   - Configured connection pooling

2. **All Models Converted**
   - User, Warehouse, Product
   - StockLocation (new table for stock tracking)
   - Receipt, ReceiptItem
   - DeliveryOrder, DeliveryOrderItem
   - Transfer, TransferItem
   - Adjustment, AdjustmentItem
   - StockLedger

3. **Model Associations**
   - All relationships defined in `Backend/models/index.js`

4. **Auth Route Updated**
   - Signup, Login, Forgot Password, Reset Password
   - Auth middleware updated

5. **Stock Service Updated**
   - Now uses Sequelize transactions
   - Works with StockLocation table

## ⚠️ Still Need to Update

The following routes still need to be converted from Mongoose to Sequelize:

1. **Backend/routes/products.js**
   - Change `Product.find()` to `Product.findAll()`
   - Change `Product.findById()` to `Product.findByPk()`
   - Update populate to use `include`
   - Update stock location queries

2. **Backend/routes/warehouses.js**
   - Similar updates as products

3. **Backend/routes/receipts.js**
   - Update to use Receipt and ReceiptItem models
   - Update includes for related data
   - Fix document number generation

4. **Backend/routes/deliveryOrders.js**
   - Update to use DeliveryOrder and DeliveryOrderItem
   - Update includes

5. **Backend/routes/transfers.js**
   - Update to use Transfer and TransferItem
   - Update includes

6. **Backend/routes/adjustments.js**
   - Update to use Adjustment and AdjustmentItem
   - Update includes

7. **Backend/routes/stockLedger.js**
   - Update queries to use Sequelize

8. **Backend/routes/dashboard.js**
   - Update all queries to Sequelize

9. **Backend/scripts/seedData.js**
   - Complete rewrite for Sequelize
   - Use transactions for data integrity

## Setup Instructions

1. **Install MySQL** (if not already installed)
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Create Database**
   ```sql
   CREATE DATABASE stockmaster;
   ```

3. **Update .env file**
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

4. **Start the server**
   - Sequelize will automatically create tables on first run
   - Or run migrations if you create them

5. **Seed the database** (after updating seed script)
   ```bash
   npm run seed
   ```

## Key Changes from MongoDB to MySQL

1. **ObjectId → Integer ID**: All IDs are now integers with auto-increment
2. **Embedded Documents → Separate Tables**: 
   - Product.stockLocations → StockLocation table
   - Receipt.items → ReceiptItem table
   - etc.
3. **Populate → Include**: Use Sequelize `include` instead of Mongoose `populate`
4. **Queries**: 
   - `Model.find()` → `Model.findAll()`
   - `Model.findById(id)` → `Model.findByPk(id)`
   - `Model.findOne({ field: value })` → `Model.findOne({ where: { field: value } })`
5. **Transactions**: Use `sequelize.transaction()` for multi-step operations

## Next Steps

Would you like me to:
1. Complete the remaining route updates?
2. Update the seed script?
3. Create database migrations?

Let me know and I'll continue with the conversion!

