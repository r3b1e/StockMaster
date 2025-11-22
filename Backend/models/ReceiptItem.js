const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReceiptItem = sequelize.define('ReceiptItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'receipt_id',
      references: {
        model: 'receipts',
        key: 'id',
        onDelete: 'CASCADE',
      },
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'unit_price',
    },
  }, {
    tableName: 'receipt_items',
    timestamps: false,
    underscored: true,
  });

  return ReceiptItem;
};

