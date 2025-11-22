const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitOfMeasure: {
      type: DataTypes.ENUM('kg', 'g', 'L', 'mL', 'pcs', 'boxes', 'units', 'meters', 'cm'),
      defaultValue: 'units',
      field: 'unit_of_measure',
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'reorder_level',
    },
    reorderQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'reorder_quantity',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
  });

  return Product;
};
