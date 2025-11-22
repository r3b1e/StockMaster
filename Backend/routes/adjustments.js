const express = require('express');
const { Adjustment, AdjustmentItem, Product, Warehouse, StockLocation, User, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const { updateStock } = require('../services/stockService');
const { generateAdjustmentNumber } = require('../utils/generateDocNumber');

const router = express.Router();

// Get all adjustments with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, warehouse } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const adjustments = await Adjustment.findAll({
      where,
      include: [
        {
          model: AdjustmentItem,
          as: 'items',
          include: [
            { model: Product },
            { model: Warehouse, as: 'warehouse' },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Filter by warehouse if provided
    let filteredAdjustments = adjustments;
    if (warehouse) {
      filteredAdjustments = adjustments.filter(adj => {
        return adj.items.some(item => item.warehouseId === parseInt(warehouse));
      });
    }

    res.json(filteredAdjustments);
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single adjustment
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id, {
      include: [
        {
          model: AdjustmentItem,
          as: 'items',
          include: [
            { model: Product },
            { model: Warehouse, as: 'warehouse' },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    res.json(adjustment);
  } catch (error) {
    console.error('Get adjustment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create adjustment
router.post('/', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, notes } = req.body;

    // Calculate differences and get recorded quantities
    const itemsWithDifferences = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.product, { transaction });
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }

        // Find stock location
        const stockLocation = await StockLocation.findOne({
          where: {
            productId: item.product,
            warehouseId: item.warehouse,
            location: item.location || '',
          },
          transaction,
        });

        const recordedQuantity = stockLocation ? stockLocation.quantity : 0;
        const physicalQuantity = item.physicalQuantity || 0;
        const difference = physicalQuantity - recordedQuantity;

        return {
          ...item,
          recordedQuantity,
          physicalQuantity,
          difference,
          reason: item.reason || '',
        };
      })
    );

    // Get warehouse code from first item
    let warehouseCode = 'WH';
    if (items && items.length > 0 && items[0].warehouse) {
      const warehouseDoc = await Warehouse.findByPk(items[0].warehouse, { transaction });
      warehouseCode = warehouseDoc?.code || 'WH';
    }
    
    // Generate adjustment number (WH/ADJ/0001 format)
    const adjustmentNumber = await generateAdjustmentNumber(Adjustment, warehouseCode);

    const adjustment = await Adjustment.create({
      adjustmentNumber,
      status: 'draft',
      notes,
      createdById: req.user.id,
    }, { transaction });

    // Create adjustment items
    await AdjustmentItem.bulkCreate(
      itemsWithDifferences.map(item => ({
        adjustmentId: adjustment.id,
        productId: item.product,
        warehouseId: item.warehouse,
        location: item.location || '',
        recordedQuantity: item.recordedQuantity,
        physicalQuantity: item.physicalQuantity,
        difference: item.difference,
        reason: item.reason,
      })),
      { transaction }
    );

    await transaction.commit();

    const populatedAdjustment = await Adjustment.findByPk(adjustment.id, {
      include: [
        {
          model: AdjustmentItem,
          as: 'items',
          include: [
            { model: Product },
            { model: Warehouse, as: 'warehouse' },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json(populatedAdjustment);
  } catch (error) {
    await transaction.rollback();
    console.error('Create adjustment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update adjustment
router.put('/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, notes, status } = req.body;

    const adjustment = await Adjustment.findByPk(req.params.id, { transaction });
    if (!adjustment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    if (adjustment.status === 'done') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cannot update completed adjustment' });
    }

    // Recalculate differences if items are updated
    if (items) {
      const itemsWithDifferences = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findByPk(item.product, { transaction });
          if (!product) {
            throw new Error(`Product ${item.product} not found`);
          }

          const stockLocation = await StockLocation.findOne({
            where: {
              productId: item.product,
              warehouseId: item.warehouse,
              location: item.location || '',
            },
            transaction,
          });

          const recordedQuantity = stockLocation ? stockLocation.quantity : 0;
          const physicalQuantity = item.physicalQuantity || 0;
          const difference = physicalQuantity - recordedQuantity;

          return {
            ...item,
            recordedQuantity,
            physicalQuantity,
            difference,
            reason: item.reason || '',
          };
        })
      );

      // Delete existing items
      await AdjustmentItem.destroy({
        where: { adjustmentId: adjustment.id },
        transaction,
      });

      // Create new items
      await AdjustmentItem.bulkCreate(
        itemsWithDifferences.map(item => ({
          adjustmentId: adjustment.id,
          productId: item.product,
          warehouseId: item.warehouse,
          location: item.location || '',
          recordedQuantity: item.recordedQuantity,
          physicalQuantity: item.physicalQuantity,
          difference: item.difference,
          reason: item.reason,
        })),
        { transaction }
      );
    }

    if (notes !== undefined) adjustment.notes = notes;
    if (status && adjustment.status !== 'done') adjustment.status = status;

    await adjustment.save({ transaction });
    await transaction.commit();

    const populatedAdjustment = await Adjustment.findByPk(adjustment.id, {
      include: [
        {
          model: AdjustmentItem,
          as: 'items',
          include: [
            { model: Product },
            { model: Warehouse, as: 'warehouse' },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedAdjustment);
  } catch (error) {
    await transaction.rollback();
    console.error('Update adjustment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Validate adjustment (update stock)
router.post('/:id/validate', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const adjustment = await Adjustment.findByPk(req.params.id, {
      include: [
        {
          model: AdjustmentItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
      transaction,
    });
    if (!adjustment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    if (adjustment.status === 'done') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Adjustment already validated' });
    }

    // Update stock for each item (adjustment sets stock to physical quantity) (use the same transaction)
    for (const item of adjustment.items) {
      await updateStock(
        item.productId,
        item.warehouseId,
        item.location || '',
        item.physicalQuantity,
        'adjustment',
        'Adjustment',
        adjustment.id,
        adjustment.adjustmentNumber,
        req.user.id,
        transaction // Pass the existing transaction
      );
    }

    // Update adjustment status
    adjustment.status = 'done';
    adjustment.validatedAt = new Date();
    adjustment.validatedById = req.user.id;
    await adjustment.save({ transaction });

    await transaction.commit();

    const populatedAdjustment = await Adjustment.findByPk(adjustment.id, {
      include: [
        {
          model: AdjustmentItem,
          as: 'items',
          include: [
            { model: Product },
            { model: Warehouse, as: 'warehouse' },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedAdjustment);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Validate adjustment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel adjustment
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    if (adjustment.status === 'done') {
      return res.status(400).json({ message: 'Cannot cancel validated adjustment' });
    }

    adjustment.status = 'canceled';
    await adjustment.save();

    res.json({ message: 'Adjustment canceled' });
  } catch (error) {
    console.error('Cancel adjustment error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
