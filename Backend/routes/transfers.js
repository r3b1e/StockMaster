const express = require('express');
const { Transfer, TransferItem, Warehouse, Product, User, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const { updateStock } = require('../services/stockService');
const { generateTransferNumber } = require('../utils/generateDocNumber');

const router = express.Router();

// Get all transfers with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, fromWarehouse, toWarehouse } = req.query;
    const { Op } = require('sequelize');
    const where = {};

    if (status) {
      where.status = status;
    }

    if (fromWarehouse || toWarehouse) {
      where[Op.or] = [];
      if (fromWarehouse) where[Op.or].push({ fromWarehouseId: fromWarehouse });
      if (toWarehouse) where[Op.or].push({ toWarehouseId: toWarehouse });
    }

    const transfers = await Transfer.findAll({
      where,
      include: [
        { model: Warehouse, as: 'fromWarehouse' },
        { model: Warehouse, as: 'toWarehouse' },
        {
          model: TransferItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(transfers);
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single transfer
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id, {
      include: [
        { model: Warehouse, as: 'fromWarehouse' },
        { model: Warehouse, as: 'toWarehouse' },
        {
          model: TransferItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    res.json(transfer);
  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create transfer
router.post('/', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { fromWarehouse, toWarehouse, fromLocation, toLocation, items, notes } = req.body;

    if (fromWarehouse === toWarehouse) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Source and destination warehouses cannot be the same' });
    }

    // Get warehouse code
    const fromWarehouseDoc = await Warehouse.findByPk(fromWarehouse, { transaction });
    if (!fromWarehouseDoc) {
      await transaction.rollback();
      return res.status(404).json({ message: 'From warehouse not found' });
    }
    const warehouseCode = fromWarehouseDoc.code || 'WH';
    
    // Generate transfer number (WH/MOVE/0001 format)
    const transferNumber = await generateTransferNumber(Transfer, warehouseCode);

    const transfer = await Transfer.create({
      transferNumber,
      fromWarehouseId: fromWarehouse,
      toWarehouseId: toWarehouse,
      fromLocation,
      toLocation,
      status: 'draft',
      notes,
      createdById: req.user.id,
    }, { transaction });

    // Create transfer items
    if (items && items.length > 0) {
      await TransferItem.bulkCreate(
        items.map(item => ({
          transferId: transfer.id,
          productId: item.product,
          quantity: item.quantity,
        })),
        { transaction }
      );
    }

    await transaction.commit();

    const populatedTransfer = await Transfer.findByPk(transfer.id, {
      include: [
        { model: Warehouse, as: 'fromWarehouse' },
        { model: Warehouse, as: 'toWarehouse' },
        {
          model: TransferItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json(populatedTransfer);
  } catch (error) {
    await transaction.rollback();
    console.error('Create transfer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update transfer
router.put('/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, notes, status } = req.body;

    const transfer = await Transfer.findByPk(req.params.id, { transaction });
    if (!transfer) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status === 'done') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cannot update completed transfer' });
    }

    if (notes !== undefined) transfer.notes = notes;
    if (status && transfer.status !== 'done') transfer.status = status;

    await transfer.save({ transaction });

    // Update items if provided
    if (items) {
      await TransferItem.destroy({
        where: { transferId: transfer.id },
        transaction,
      });

      await TransferItem.bulkCreate(
        items.map(item => ({
          transferId: transfer.id,
          productId: item.product,
          quantity: item.quantity,
        })),
        { transaction }
      );
    }

    await transaction.commit();

    const populatedTransfer = await Transfer.findByPk(transfer.id, {
      include: [
        { model: Warehouse, as: 'fromWarehouse' },
        { model: Warehouse, as: 'toWarehouse' },
        {
          model: TransferItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedTransfer);
  } catch (error) {
    await transaction.rollback();
    console.error('Update transfer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Validate transfer (update stock)
router.post('/:id/validate', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const transfer = await Transfer.findByPk(req.params.id, {
      include: [
        {
          model: TransferItem,
          as: 'items',
          include: [{ model: Product }],
        },
      ],
      transaction,
    });
    if (!transfer) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status === 'done') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Transfer already validated' });
    }

    // Update stock: decrease from source, increase to destination (use the same transaction)
    for (const item of transfer.items) {
      // Decrease from source warehouse
      await updateStock(
        item.productId,
        transfer.fromWarehouseId,
        transfer.fromLocation || '',
        item.quantity,
        'transfer_out',
        'Transfer',
        transfer.id,
        transfer.transferNumber,
        req.user.id,
        transaction // Pass the existing transaction
      );

      // Increase to destination warehouse
      await updateStock(
        item.productId,
        transfer.toWarehouseId,
        transfer.toLocation || '',
        item.quantity,
        'transfer_in',
        'Transfer',
        transfer.id,
        transfer.transferNumber,
        req.user.id,
        transaction // Pass the existing transaction
      );
    }

    // Update transfer status
    transfer.status = 'done';
    transfer.validatedAt = new Date();
    transfer.validatedById = req.user.id;
    await transfer.save({ transaction });

    await transaction.commit();

    const populatedTransfer = await Transfer.findByPk(transfer.id, {
      include: [
        { model: Warehouse, as: 'fromWarehouse' },
        { model: Warehouse, as: 'toWarehouse' },
        {
          model: TransferItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedTransfer);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Validate transfer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel transfer
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status === 'done') {
      return res.status(400).json({ message: 'Cannot cancel validated transfer' });
    }

    transfer.status = 'canceled';
    await transfer.save();

    res.json({ message: 'Transfer canceled' });
  } catch (error) {
    console.error('Cancel transfer error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
