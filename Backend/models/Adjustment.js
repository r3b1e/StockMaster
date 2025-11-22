const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Adjustment = sequelize.define('Adjustment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adjustmentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'adjustment_number',
    },
    status: {
      type: DataTypes.ENUM('draft', 'waiting', 'ready', 'done', 'canceled'),
      defaultValue: 'draft',
    },
    adjustmentDate: {
      type: DataTypes.DATE,
      field: 'adjustment_date',
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
    tableName: 'adjustments',
    timestamps: true,
    underscored: true,
  });

  return Adjustment;
};
