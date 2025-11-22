const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryOrderItem = sequelize.define('DeliveryOrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deliveryOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'delivery_order_id',
      references: {
        model: 'delivery_orders',
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
    pickedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'picked_quantity',
    },
    packedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'packed_quantity',
    },
  }, {
    tableName: 'delivery_order_items',
    timestamps: false,
    underscored: true,
  });

  return DeliveryOrderItem;
};

