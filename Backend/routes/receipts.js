const express = require('express');
const { Receipt, ReceiptItem, Warehouse, Product, User, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const { updateStock } = require('../services/stockService');
const { generateReceiptNumber } = require('../utils/generateDocNumber');

const router = express.Router();

// Get all receipts with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, warehouse } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (warehouse) {
      where.warehouseId = warehouse;
    }

    const receipts = await Receipt.findAll({
      where,
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: ReceiptItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(receipts);
  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single receipt
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: ReceiptItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create receipt
router.post('/', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplier, warehouse: warehouseId, items, notes, scheduleDate } = req.body;

    // Get warehouse code
    const warehouse = await Warehouse.findByPk(warehouseId, { transaction });
    if (!warehouse) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    const warehouseCode = warehouse.code || 'WH';
    
    // Generate receipt number (WH/IN/0001 format)
    const receiptNumber = await generateReceiptNumber(Receipt, warehouseCode);

    const receipt = await Receipt.create({
      receiptNumber,
      supplier,
      warehouseId,
      status: 'draft',
      scheduleDate: scheduleDate ? new Date(scheduleDate) : undefined,
      notes,
      createdById: req.user.id,
    }, { transaction });

    // Create receipt items
    if (items && items.length > 0) {
      await ReceiptItem.bulkCreate(
        items.map(item => ({
          receiptId: receipt.id,
          productId: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0,
        })),
        { transaction }
      );
    }

    await transaction.commit();

    // Fetch with relations (outside transaction since it's just a read)
    const populatedReceipt = await Receipt.findByPk(receipt.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: ReceiptItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json(populatedReceipt);
  } catch (error) {
    // Only rollback if transaction is still active
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Create receipt error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update receipt
router.put('/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplier, items, notes, status, scheduleDate } = req.body;

    const receipt = await Receipt.findByPk(req.params.id, { transaction });
    if (!receipt) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Cannot update if already done
    if (receipt.status === 'done') {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: 'Cannot update completed receipt' });
    }

    if (supplier) receipt.supplier = supplier;
    if (notes !== undefined) receipt.notes = notes;
    if (status && receipt.status !== 'done') receipt.status = status;
    if (scheduleDate) receipt.scheduleDate = new Date(scheduleDate);

    await receipt.save({ transaction });

    // Update items if provided
    if (items) {
      // Delete existing items
      await ReceiptItem.destroy({
        where: { receiptId: receipt.id },
        transaction,
      });

      // Create new items
      await ReceiptItem.bulkCreate(
        items.map(item => ({
          receiptId: receipt.id,
          productId: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0,
        })),
        { transaction }
      );
    }

    await transaction.commit();

    const populatedReceipt = await Receipt.findByPk(receipt.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: ReceiptItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedReceipt);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Update receipt error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Validate receipt (update stock)
router.post('/:id/validate', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const receipt = await Receipt.findByPk(req.params.id, {
      include: [
        {
          model: ReceiptItem,
          as: 'items',
          include: [{ model: Product }],
        },
      ],
      transaction,
    });

    if (!receipt) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'done') {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: 'Receipt already validated' });
    }

    // Update stock for each item (use the same transaction)
    for (const item of receipt.items) {
      await updateStock(
        item.productId,
        receipt.warehouseId,
        '', // location can be added later
        item.quantity,
        'receipt',
        'Receipt',
        receipt.id,
        receipt.receiptNumber,
        req.user.id,
        transaction // Pass the existing transaction
      );
    }

    // Update receipt status
    receipt.status = 'done';
    receipt.validatedAt = new Date();
    receipt.validatedById = req.user.id;
    await receipt.save({ transaction });

    await transaction.commit();

    const populatedReceipt = await Receipt.findByPk(receipt.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: ReceiptItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedReceipt);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Validate receipt error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel receipt
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'done') {
      return res.status(400).json({ message: 'Cannot cancel validated receipt' });
    }

    receipt.status = 'canceled';
    await receipt.save();

    res.json({ message: 'Receipt canceled' });
  } catch (error) {
    console.error('Cancel receipt error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
