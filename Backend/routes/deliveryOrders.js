const express = require('express');
const { DeliveryOrder, DeliveryOrderItem, Warehouse, Product, User, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const { updateStock } = require('../services/stockService');
const { generateDeliveryNumber } = require('../utils/generateDocNumber');

const router = express.Router();

// Get all delivery orders with filters
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

    const orders = await DeliveryOrder.findAll({
      where,
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    console.error('Get delivery orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single delivery order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await DeliveryOrder.findByPk(req.params.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get delivery order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create delivery order
router.post('/', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customer, warehouse: warehouseId, items, notes, scheduleDate } = req.body;

    // Get warehouse code
    const warehouse = await Warehouse.findByPk(warehouseId, { transaction });
    if (!warehouse) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    const warehouseCode = warehouse.code || 'WH';
    
    // Generate order number (WH/OUT/0001 format)
    const orderNumber = await generateDeliveryNumber(DeliveryOrder, warehouseCode);

    const order = await DeliveryOrder.create({
      orderNumber,
      customer,
      warehouseId,
      status: 'draft',
      scheduleDate: scheduleDate ? new Date(scheduleDate) : undefined,
      notes,
      createdById: req.user.id,
    }, { transaction });

    // Create order items
    if (items && items.length > 0) {
      await DeliveryOrderItem.bulkCreate(
        items.map(item => ({
          deliveryOrderId: order.id,
          productId: item.product,
          quantity: item.quantity,
          pickedQuantity: 0,
          packedQuantity: 0,
        })),
        { transaction }
      );
    }

    await transaction.commit();

    const populatedOrder = await DeliveryOrder.findByPk(order.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json(populatedOrder);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Create delivery order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update delivery order
router.put('/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customer, items, notes, status, scheduleDate } = req.body;

    const order = await DeliveryOrder.findByPk(req.params.id, {
      include: [{ model: DeliveryOrderItem, as: 'items' }],
      transaction,
    });
    if (!order) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    if (order.status === 'done') {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: 'Cannot update completed order' });
    }

    if (customer) order.customer = customer;
    if (notes !== undefined) order.notes = notes;
    if (status && order.status !== 'done') order.status = status;
    if (scheduleDate) order.scheduleDate = new Date(scheduleDate);

    await order.save({ transaction });

    // Update items if provided
    if (items) {
      // Delete existing items
      await DeliveryOrderItem.destroy({
        where: { deliveryOrderId: order.id },
        transaction,
      });

      // Create new items (preserve picked/packed quantities if they exist)
      const existingItems = order.items || [];
      await DeliveryOrderItem.bulkCreate(
        items.map(item => {
          const existingItem = existingItems.find(i => i.productId === item.product);
          return {
            deliveryOrderId: order.id,
            productId: item.product,
            quantity: item.quantity,
            pickedQuantity: existingItem?.pickedQuantity || 0,
            packedQuantity: existingItem?.packedQuantity || 0,
          };
        }),
        { transaction }
      );
    }

    await transaction.commit();

    const populatedOrder = await DeliveryOrder.findByPk(order.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedOrder);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Update delivery order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Pick items
router.post('/:id/pick', authMiddleware, async (req, res) => {
  try {
    const { itemPicks } = req.body;

    const order = await DeliveryOrder.findByPk(req.params.id, {
      include: [
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    // Update picked quantities
    for (const pick of itemPicks) {
      const item = order.items.find(i => i.productId === pick.productId);
      if (item) {
        item.pickedQuantity = pick.pickedQuantity;
        await item.save();
        if (item.pickedQuantity === item.quantity) {
          order.status = 'ready';
        }
      }
    }

    await order.save();

    const populatedOrder = await DeliveryOrder.findByPk(order.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedOrder);
  } catch (error) {
    console.error('Pick items error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Pack items
router.post('/:id/pack', authMiddleware, async (req, res) => {
  try {
    const { itemPacks } = req.body;

    const order = await DeliveryOrder.findByPk(req.params.id, {
      include: [
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    // Update packed quantities
    for (const pack of itemPacks) {
      const item = order.items.find(i => i.productId === pack.productId);
      if (item) {
        item.packedQuantity = pack.packedQuantity;
        await item.save();
      }
    }

    await order.save();

    const populatedOrder = await DeliveryOrder.findByPk(order.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedOrder);
  } catch (error) {
    console.error('Pack items error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Validate delivery order (update stock)
router.post('/:id/validate', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await DeliveryOrder.findByPk(req.params.id, {
      include: [
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
      ],
      transaction,
    });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    if (order.status === 'done') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Order already validated' });
    }

    // Update stock for each item (use the same transaction)
    for (const item of order.items) {
      await updateStock(
        item.productId,
        order.warehouseId,
        '',
        item.quantity,
        'delivery',
        'DeliveryOrder',
        order.id,
        order.orderNumber,
        req.user.id,
        transaction // Pass the existing transaction
      );
    }

    // Update order status
    order.status = 'done';
    order.validatedAt = new Date();
    order.validatedById = req.user.id;
    await order.save({ transaction });

    await transaction.commit();

    const populatedOrder = await DeliveryOrder.findByPk(order.id, {
      include: [
        { model: Warehouse, as: 'warehouse' },
        {
          model: DeliveryOrderItem,
          as: 'items',
          include: [{ model: Product }],
        },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'validator', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(populatedOrder);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Validate delivery order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel delivery order
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await DeliveryOrder.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    if (order.status === 'done') {
      return res.status(400).json({ message: 'Cannot cancel validated order' });
    }

    order.status = 'canceled';
    await order.save();

    res.json({ message: 'Delivery order canceled' });
  } catch (error) {
    console.error('Cancel delivery order error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
