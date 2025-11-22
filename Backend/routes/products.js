const express = require('express');
const { Product, StockLocation, Warehouse, sequelize } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate total stock
const getTotalStock = (stockLocations) => {
  return stockLocations.reduce((total, loc) => total + (loc.quantity || 0), 0);
};

// Helper function to check if low stock
const isLowStock = (totalStock, reorderLevel) => {
  return totalStock <= reorderLevel;
};

// Get all products with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, search, warehouse, lowStock } = req.query;
    const where = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search.toUpperCase()}%` } },
      ];
    }

    let products = await Product.findAll({
      where,
      include: [{
        model: StockLocation,
        as: 'stockLocations',
        include: [{
          model: Warehouse,
          as: 'warehouse',
        }],
      }],
    });

    // Filter by warehouse
    if (warehouse) {
      products = products.filter(product => {
        return product.stockLocations.some(loc => loc.warehouseId === parseInt(warehouse));
      });
    }

    // Calculate total stock and check low stock
    const productsWithStock = products.map(product => {
      const productData = product.toJSON();
      const totalStock = getTotalStock(product.stockLocations || []);
      productData.totalStock = totalStock;
      productData.isLowStock = isLowStock(totalStock, product.reorderLevel);
      return productData;
    });

    // Filter low stock
    if (lowStock === 'true') {
      const filtered = productsWithStock.filter(p => p.isLowStock);
      return res.json(filtered);
    }

    res.json(productsWithStock);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: StockLocation,
        as: 'stockLocations',
        include: [{
          model: Warehouse,
          as: 'warehouse',
        }],
      }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = product.toJSON();
    const totalStock = getTotalStock(product.stockLocations || []);
    productData.totalStock = totalStock;
    productData.isLowStock = isLowStock(totalStock, product.reorderLevel);

    res.json(productData);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, sku, category, unitOfMeasure, reorderLevel, reorderQuantity, initialStock, warehouse } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({
      where: { sku: sku.toUpperCase() },
      transaction,
    });
    if (existingProduct) {
      await transaction.rollback();
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      category,
      unitOfMeasure,
      reorderLevel: reorderLevel || 0,
      reorderQuantity: reorderQuantity || 0,
    }, { transaction });

    // Add initial stock if provided
    if (initialStock && warehouse) {
      await StockLocation.create({
        productId: product.id,
        warehouseId: warehouse,
        quantity: initialStock,
      }, { transaction });
    }

    await transaction.commit();

    const productData = product.toJSON();
    productData.totalStock = initialStock || 0;
    productData.isLowStock = isLowStock(initialStock || 0, product.reorderLevel);

    res.status(201).json(productData);
  } catch (error) {
    await transaction.rollback();
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, unitOfMeasure, reorderLevel, reorderQuantity } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (unitOfMeasure) product.unitOfMeasure = unitOfMeasure;
    if (reorderLevel !== undefined) product.reorderLevel = reorderLevel;
    if (reorderQuantity !== undefined) product.reorderQuantity = reorderQuantity;

    await product.save();

    const stockLocations = await StockLocation.findAll({
      where: { productId: product.id },
    });

    const productData = product.toJSON();
    const totalStock = getTotalStock(stockLocations);
    productData.totalStock = totalStock;
    productData.isLowStock = isLowStock(totalStock, product.reorderLevel);

    res.json(productData);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete/Deactivate product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deactivated' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product categories
router.get('/categories/list', authMiddleware, async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
    });
    const categories = products.map(p => p.category);
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
