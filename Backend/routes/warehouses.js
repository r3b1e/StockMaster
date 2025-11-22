const express = require('express');
const { Warehouse } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all warehouses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });
    res.json(warehouses);
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single warehouse
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(warehouse);
  } catch (error) {
    console.error('Get warehouse error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create warehouse
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, code, address, location } = req.body;

    // Check if code already exists
    const existingWarehouse = await Warehouse.findOne({
      where: { code: code.toUpperCase() },
    });
    if (existingWarehouse) {
      return res.status(400).json({ message: 'Warehouse code already exists' });
    }

    const warehouse = await Warehouse.create({
      name,
      code: code.toUpperCase(),
      address,
      location,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update warehouse
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, address, location } = req.body;

    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    if (name) warehouse.name = name;
    if (address !== undefined) warehouse.address = address;
    if (location !== undefined) warehouse.location = location;

    await warehouse.save();
    res.json(warehouse);
  } catch (error) {
    console.error('Update warehouse error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete/Deactivate warehouse
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    warehouse.isActive = false;
    await warehouse.save();

    res.json({ message: 'Warehouse deactivated' });
  } catch (error) {
    console.error('Delete warehouse error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
