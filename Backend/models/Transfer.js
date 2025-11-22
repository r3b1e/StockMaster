const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transfer = sequelize.define('Transfer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transferNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'transfer_number',
    },
    fromWarehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'from_warehouse_id',
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    toWarehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'to_warehouse_id',
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    fromLocation: {
      type: DataTypes.STRING,
      field: 'from_location',
    },
    toLocation: {
      type: DataTypes.STRING,
      field: 'to_location',
    },
    status: {
      type: DataTypes.ENUM('draft', 'waiting', 'ready', 'done', 'canceled'),
      defaultValue: 'draft',
    },
    transferDate: {
      type: DataTypes.DATE,
      field: 'transfer_date',
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
    tableName: 'transfers',
    timestamps: true,
    underscored: true,
  });

  return Transfer;
};
