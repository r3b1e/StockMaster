const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AdjustmentItem = sequelize.define('AdjustmentItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adjustmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'adjustment_id',
      references: {
        model: 'adjustments',
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
    recordedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'recorded_quantity',
    },
    physicalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'physical_quantity',
    },
    difference: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'adjustment_items',
    timestamps: false,
    underscored: true,
  });

  return AdjustmentItem;
};

