const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockLocation = sequelize.define('StockLocation', {
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
      defaultValue: '',
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: 'stock_locations',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'warehouse_id', 'location'],
      },
    ],
  });

  return StockLocation;
};

