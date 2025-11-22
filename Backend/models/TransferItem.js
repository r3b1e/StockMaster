const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransferItem = sequelize.define('TransferItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transferId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'transfer_id',
      references: {
        model: 'transfers',
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
  }, {
    tableName: 'transfer_items',
    timestamps: false,
    underscored: true,
  });

  return TransferItem;
};

