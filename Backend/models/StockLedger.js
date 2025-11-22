const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockLedger = sequelize.define('StockLedger', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'warehouse_id',
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    location: {
      type: DataTypes.STRING,
    },
    transactionType: {
      type: DataTypes.ENUM('receipt', 'delivery', 'transfer_in', 'transfer_out', 'adjustment'),
      allowNull: false,
      field: 'transaction_type',
    },
    documentType: {
      type: DataTypes.ENUM('Receipt', 'DeliveryOrder', 'Transfer', 'Adjustment'),
      allowNull: false,
      field: 'document_type',
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'document_id',
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'document_number',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantityAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quantity_after',
    },
    createdById: {
      type: DataTypes.INTEGER,
      field: 'created_by_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'stock_ledger',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['product_id', 'warehouse_id', 'created_at'],
      },
      {
        fields: ['document_type', 'document_id'],
      },
    ],
  });

  return StockLedger;
};
