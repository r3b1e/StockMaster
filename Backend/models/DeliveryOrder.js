const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryOrder = sequelize.define('DeliveryOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'order_number',
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
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
    status: {
      type: DataTypes.ENUM('draft', 'waiting', 'ready', 'done', 'canceled'),
      defaultValue: 'draft',
    },
    deliveryDate: {
      type: DataTypes.DATE,
      field: 'delivery_date',
    },
    scheduleDate: {
      type: DataTypes.DATE,
      field: 'schedule_date',
    },
    validatedAt: {
      type: DataTypes.DATE,
      field: 'validated_at',
    },
    validatedById: {
      type: DataTypes.INTEGER,
      field: 'validated_by_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'delivery_orders',
    timestamps: true,
    underscored: true,
  });

  return DeliveryOrder;
};
