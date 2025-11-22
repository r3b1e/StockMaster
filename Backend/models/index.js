const { sequelize } = require('../config/database');
const User = require('./User')(sequelize);
const Warehouse = require('./Warehouse')(sequelize);
const Product = require('./Product')(sequelize);
const StockLocation = require('./StockLocation')(sequelize);
const Receipt = require('./Receipt')(sequelize);
const ReceiptItem = require('./ReceiptItem')(sequelize);
const DeliveryOrder = require('./DeliveryOrder')(sequelize);
const DeliveryOrderItem = require('./DeliveryOrderItem')(sequelize);
const Transfer = require('./Transfer')(sequelize);
const TransferItem = require('./TransferItem')(sequelize);
const Adjustment = require('./Adjustment')(sequelize);
const AdjustmentItem = require('./AdjustmentItem')(sequelize);
const StockLedger = require('./StockLedger')(sequelize);

// Define associations
// User associations
User.hasMany(Receipt, { foreignKey: 'createdById', as: 'createdReceipts' });
User.hasMany(Receipt, { foreignKey: 'validatedById', as: 'validatedReceipts' });
User.hasMany(DeliveryOrder, { foreignKey: 'createdById', as: 'createdOrders' });
User.hasMany(DeliveryOrder, { foreignKey: 'validatedById', as: 'validatedOrders' });
User.hasMany(Transfer, { foreignKey: 'createdById', as: 'createdTransfers' });
User.hasMany(Transfer, { foreignKey: 'validatedById', as: 'validatedTransfers' });
User.hasMany(Adjustment, { foreignKey: 'createdById', as: 'createdAdjustments' });
User.hasMany(Adjustment, { foreignKey: 'validatedById', as: 'validatedAdjustments' });
User.hasMany(StockLedger, { foreignKey: 'createdById', as: 'ledgerEntries' });

// Warehouse associations
Warehouse.hasMany(StockLocation, { foreignKey: 'warehouseId', as: 'stockLocations' });
Warehouse.hasMany(Receipt, { foreignKey: 'warehouseId' });
Warehouse.hasMany(DeliveryOrder, { foreignKey: 'warehouseId' });
Warehouse.hasMany(Transfer, { foreignKey: 'fromWarehouseId', as: 'outgoingTransfers' });
Warehouse.hasMany(Transfer, { foreignKey: 'toWarehouseId', as: 'incomingTransfers' });
Warehouse.hasMany(StockLedger, { foreignKey: 'warehouseId' });

// Product associations
Product.hasMany(StockLocation, { foreignKey: 'productId', as: 'stockLocations' });
Product.hasMany(ReceiptItem, { foreignKey: 'productId' });
Product.hasMany(DeliveryOrderItem, { foreignKey: 'productId' });
Product.hasMany(TransferItem, { foreignKey: 'productId' });
Product.hasMany(AdjustmentItem, { foreignKey: 'productId' });
Product.hasMany(StockLedger, { foreignKey: 'productId' });

// Receipt associations
Receipt.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
Receipt.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
Receipt.belongsTo(User, { foreignKey: 'validatedById', as: 'validator' });
Receipt.hasMany(ReceiptItem, { foreignKey: 'receiptId', as: 'items' });

// ReceiptItem associations
ReceiptItem.belongsTo(Receipt, { foreignKey: 'receiptId' });
ReceiptItem.belongsTo(Product, { foreignKey: 'productId' });

// DeliveryOrder associations
DeliveryOrder.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
DeliveryOrder.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
DeliveryOrder.belongsTo(User, { foreignKey: 'validatedById', as: 'validator' });
DeliveryOrder.hasMany(DeliveryOrderItem, { foreignKey: 'deliveryOrderId', as: 'items' });

// DeliveryOrderItem associations
DeliveryOrderItem.belongsTo(DeliveryOrder, { foreignKey: 'deliveryOrderId' });
DeliveryOrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Transfer associations
Transfer.belongsTo(Warehouse, { foreignKey: 'fromWarehouseId', as: 'fromWarehouse' });
Transfer.belongsTo(Warehouse, { foreignKey: 'toWarehouseId', as: 'toWarehouse' });
Transfer.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
Transfer.belongsTo(User, { foreignKey: 'validatedById', as: 'validator' });
Transfer.hasMany(TransferItem, { foreignKey: 'transferId', as: 'items' });

// TransferItem associations
TransferItem.belongsTo(Transfer, { foreignKey: 'transferId' });
TransferItem.belongsTo(Product, { foreignKey: 'productId' });

// Adjustment associations
Adjustment.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
Adjustment.belongsTo(User, { foreignKey: 'validatedById', as: 'validator' });
Adjustment.hasMany(AdjustmentItem, { foreignKey: 'adjustmentId', as: 'items' });

// AdjustmentItem associations
AdjustmentItem.belongsTo(Adjustment, { foreignKey: 'adjustmentId' });
AdjustmentItem.belongsTo(Product, { foreignKey: 'productId' });
AdjustmentItem.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

// StockLocation associations
StockLocation.belongsTo(Product, { foreignKey: 'productId' });
StockLocation.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

// StockLedger associations
StockLedger.belongsTo(Product, { foreignKey: 'productId' });
StockLedger.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
StockLedger.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

module.exports = {
  sequelize,
  User,
  Warehouse,
  Product,
  StockLocation,
  Receipt,
  ReceiptItem,
  DeliveryOrder,
  DeliveryOrderItem,
  Transfer,
  TransferItem,
  Adjustment,
  AdjustmentItem,
  StockLedger,
};
