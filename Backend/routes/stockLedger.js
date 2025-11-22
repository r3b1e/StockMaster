const express = require('express');
const { StockLedger, Product, Warehouse, User } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get stock ledger/move history with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { product, warehouse, documentType, transactionType, startDate, endDate } = req.query;
    const where = {};

    if (product) {
      where.productId = product;
    }

    if (warehouse) {
      where.warehouseId = warehouse;
    }

    if (documentType) {
      where.documentType = documentType;
    }

    if (transactionType) {
      where.transactionType = transactionType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const ledger = await StockLedger.findAll({
      where,
      include: [
        { model: Product },
        { model: Warehouse, as: 'warehouse' },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 1000,
    });

    res.json(ledger);
  } catch (error) {
    console.error('Get stock ledger error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product movement history
router.get('/product/:productId', authMiddleware, async (req, res) => {
  try {
    const { warehouse } = req.query;
    const where = { productId: req.params.productId };

    if (warehouse) {
      where.warehouseId = warehouse;
    }

    const ledger = await StockLedger.findAll({
      where,
      include: [
        { model: Product, as: 'product' },
        { model: Warehouse, as: 'warehouse' },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(ledger);
  } catch (error) {
    console.error('Get product ledger error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
