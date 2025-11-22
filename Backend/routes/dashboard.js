const express = require('express');
const { Product, StockLocation, Receipt, DeliveryOrder, Transfer, sequelize } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper to calculate total stock
const getTotalStock = (stockLocations) => {
  return stockLocations.reduce((total, loc) => total + (loc.quantity || 0), 0);
};

// Get dashboard KPIs
router.get('/kpis', authMiddleware, async (req, res) => {
  try {
    // Total products in stock
    const totalProducts = await Product.count({
      where: { isActive: true },
    });

    // Low stock / Out of stock items
    const products = await Product.findAll({
      where: { isActive: true },
      include: [{
        model: StockLocation,
        as: 'stockLocations',
      }],
    });

    let lowStockItems = 0;
    let outOfStockItems = 0;

    products.forEach(product => {
      const totalStock = getTotalStock(product.stockLocations || []);
      if (totalStock === 0) {
        outOfStockItems++;
      } else if (totalStock <= product.reorderLevel) {
        lowStockItems++;
      }
    });

    // Pending receipts (not done or canceled)
    const pendingReceipts = await Receipt.count({
      where: {
        status: {
          [Op.notIn]: ['done', 'canceled'],
        },
      },
    });

    // Pending deliveries (not done or canceled)
    const pendingDeliveries = await DeliveryOrder.count({
      where: {
        status: {
          [Op.notIn]: ['done', 'canceled'],
        },
      },
    });

    // Internal transfers scheduled (not done or canceled)
    const scheduledTransfers = await Transfer.count({
      where: {
        status: {
          [Op.notIn]: ['done', 'canceled'],
        },
      },
    });

    res.json({
      totalProducts,
      lowStockItems,
      outOfStockItems,
      pendingReceipts,
      pendingDeliveries,
      scheduledTransfers,
    });
  } catch (error) {
    console.error('Get dashboard KPIs error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard data with filters
router.get('/data', authMiddleware, async (req, res) => {
  try {
    const { documentType, status, warehouse, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt[Op.gte] = new Date(startDate);
      if (endDate) dateFilter.createdAt[Op.lte] = new Date(endDate);
    }

    const allDocuments = [];

    // Get receipts
    if (!documentType || documentType === 'Receipt') {
      const receiptWhere = { ...dateFilter };
      if (status) receiptWhere.status = status;
      if (warehouse) receiptWhere.warehouseId = warehouse;

      const receipts = await Receipt.findAll({
        where: receiptWhere,
        include: [
          { model: require('../models').Warehouse, as: 'warehouse' },
          {
            model: require('../models').ReceiptItem,
            as: 'items',
            include: [{ model: Product }],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 50,
      });

      allDocuments.push(...receipts.map(doc => ({ ...doc.toJSON(), type: 'Receipt' })));
    }

    // Get delivery orders
    if (!documentType || documentType === 'DeliveryOrder') {
      const deliveryWhere = { ...dateFilter };
      if (status) deliveryWhere.status = status;
      if (warehouse) deliveryWhere.warehouseId = warehouse;

      const deliveries = await DeliveryOrder.findAll({
        where: deliveryWhere,
        include: [
          { model: require('../models').Warehouse, as: 'warehouse' },
          {
            model: require('../models').DeliveryOrderItem,
            as: 'items',
            include: [{ model: Product }],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 50,
      });

      allDocuments.push(...deliveries.map(doc => ({ ...doc.toJSON(), type: 'DeliveryOrder' })));
    }

    // Get transfers
    if (!documentType || documentType === 'Transfer') {
      const transferWhere = { ...dateFilter };
      if (status) transferWhere.status = status;
      if (warehouse) {
        transferWhere[Op.or] = [
          { fromWarehouseId: warehouse },
          { toWarehouseId: warehouse },
        ];
      }

      const transfers = await Transfer.findAll({
        where: transferWhere,
        include: [
          { model: require('../models').Warehouse, as: 'fromWarehouse' },
          { model: require('../models').Warehouse, as: 'toWarehouse' },
          {
            model: require('../models').TransferItem,
            as: 'items',
            include: [{ model: Product }],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 50,
      });

      allDocuments.push(...transfers.map(doc => ({ ...doc.toJSON(), type: 'Transfer' })));
    }

    // Sort all documents by date
    allDocuments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allDocuments);
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
