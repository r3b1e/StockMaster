require('dotenv').config();
const { sequelize, connectDB } = require('../config/database');
const {
  User,
  Warehouse,
  Product,
  StockLocation,
  Receipt,
  ReceiptItem,
  DeliveryOrder,
  DeliveryOrderItem,
  Transfer,
  TransferItem,
  Adjustment,
  AdjustmentItem,
  StockLedger,
} = require('../models');
const { updateStock } = require('../services/stockService');

// Sample data
const sampleUsers = [
  {
    name: 'John Anderson',
    email: 'john.anderson@stockmaster.com',
    password: 'password123',
    role: 'inventory_manager',
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@stockmaster.com',
    password: 'password123',
    role: 'warehouse_staff',
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@stockmaster.com',
    password: 'password123',
    role: 'warehouse_staff',
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@stockmaster.com',
    password: 'password123',
    role: 'admin',
  },
];

const sampleWarehouses = [
  {
    name: 'Main Warehouse',
    code: 'WH',
    address: '123 Industrial Park Road, Manufacturing District',
    location: 'Building A, Floor 1',
  },
  {
    name: 'Production Stock',
    code: 'PROD',
    address: '456 Production Avenue, Manufacturing District',
    location: 'Building B, Floor 2',
  },
  {
    name: 'Distribution Center',
    code: 'DIST',
    address: '789 Logistics Boulevard, Distribution Zone',
    location: 'Building C, Ground Floor',
  },
];

// Generate more products
const generateProducts = () => {
  const categories = ['Furniture', 'Raw Materials', 'Electronics', 'Office Supplies', 'Tools', 'Packaging', 'Safety Equipment', 'Maintenance'];
  const units = ['units', 'kg', 'g', 'L', 'mL', 'boxes', 'pcs', 'meters', 'cm'];
  const products = [];
  
  const furnitureItems = ['Desk', 'Chair', 'Cabinet', 'Shelf', 'Table', 'Stool', 'Bench', 'Rack'];
  const rawMaterials = ['Steel Rods', 'Aluminum Sheets', 'Copper Wire', 'Plastic Sheets', 'Wood Planks', 'Glass Panels', 'Concrete Blocks', 'Bricks'];
  const electronics = ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Printer', 'Scanner', 'Projector', 'Router'];
  const officeSupplies = ['Paper A4', 'Paper A3', 'Pens', 'Pencils', 'Folders', 'Binders', 'Stapler', 'Tape'];
  const tools = ['Hammer', 'Screwdriver', 'Wrench', 'Drill', 'Saw', 'Pliers', 'Measuring Tape', 'Level'];
  const packaging = ['Boxes', 'Bubble Wrap', 'Tape', 'Labels', 'Bags', 'Cushioning', 'Straps', 'Wrappers'];
  const safety = ['Helmet', 'Gloves', 'Safety Glasses', 'Vest', 'Boots', 'Mask', 'Ear Protection', 'First Aid Kit'];
  const maintenance = ['Cleaning Supplies', 'Lubricants', 'Filters', 'Batteries', 'Light Bulbs', 'Cables', 'Connectors', 'Switches'];
  
  const allItems = [
    ...furnitureItems.map(name => ({ name, category: 'Furniture', unit: 'units', reorderLevel: 10, reorderQty: 50 })),
    ...rawMaterials.map(name => ({ name, category: 'Raw Materials', unit: 'kg', reorderLevel: 500, reorderQty: 2000 })),
    ...electronics.map(name => ({ name, category: 'Electronics', unit: 'units', reorderLevel: 5, reorderQty: 20 })),
    ...officeSupplies.map(name => ({ name, category: 'Office Supplies', unit: 'boxes', reorderLevel: 20, reorderQty: 100 })),
    ...tools.map(name => ({ name, category: 'Tools', unit: 'units', reorderLevel: 15, reorderQty: 60 })),
    ...packaging.map(name => ({ name, category: 'Packaging', unit: 'units', reorderLevel: 30, reorderQty: 150 })),
    ...safety.map(name => ({ name, category: 'Safety Equipment', unit: 'units', reorderLevel: 25, reorderQty: 100 })),
    ...maintenance.map(name => ({ name, category: 'Maintenance', unit: 'units', reorderLevel: 12, reorderQty: 50 })),
  ];
  
  allItems.forEach((item, index) => {
    const sku = `${item.category.substring(0, 3).toUpperCase()}${String(index + 1).padStart(3, '0')}`;
    products.push({
      name: item.name,
      sku,
      category: item.category,
      unitOfMeasure: item.unit,
      reorderLevel: item.reorderLevel,
      reorderQuantity: item.reorderQty,
    });
  });
  
  return products;
};

const sampleProducts = generateProducts();

const sampleSuppliers = [
  'Anne Interior Solutions',
  'Global Suppliers Inc.',
  'Prime Materials Co.',
  'Tech Distributors Ltd.',
  'Office World Supplies',
  'Industrial Equipment Corp.',
  'Metro Supply Chain',
  'Pacific Manufacturing',
  'Atlantic Trading Co.',
  'Continental Distributors',
];

const sampleCustomers = [
  'Anne Interior Solutions',
  'ABC Corporation',
  'XYZ Enterprises',
  'Tech Solutions Ltd.',
  'Business Partners Inc.',
  'Modern Office Co.',
  'Premier Industries',
  'Global Commerce Group',
  'Elite Business Solutions',
  'Corporate Ventures',
];

// Generate random date within last 90 days
const randomDate = (daysAgo) => {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * daysAgo);
  return new Date(now - randomDays * 24 * 60 * 60 * 1000);
};

// Generate random status
const randomStatus = () => {
  const statuses = ['draft', 'waiting', 'ready', 'done', 'done', 'done', 'canceled'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await StockLedger.destroy({ where: {}, force: true });
    await AdjustmentItem.destroy({ where: {}, force: true });
    await Adjustment.destroy({ where: {}, force: true });
    await TransferItem.destroy({ where: {}, force: true });
    await Transfer.destroy({ where: {}, force: true });
    await DeliveryOrderItem.destroy({ where: {}, force: true });
    await DeliveryOrder.destroy({ where: {}, force: true });
    await ReceiptItem.destroy({ where: {}, force: true });
    await Receipt.destroy({ where: {}, force: true });
    await StockLocation.destroy({ where: {}, force: true });
    await Product.destroy({ where: {}, force: true });
    await Warehouse.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // Seed Users (use individual create to trigger password hashing hooks)
    console.log('Seeding users...');
    const users = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      users.push(user);
    }
    console.log(`Created ${users.length} users`);

    // Seed Warehouses
    console.log('Seeding warehouses...');
    const warehouses = await Warehouse.bulkCreate(sampleWarehouses);
    console.log(`Created ${warehouses.length} warehouses`);

    const mainWarehouse = warehouses.find((w) => w.code === 'WH');
    const prodWarehouse = warehouses.find((w) => w.code === 'PROD');
    const distWarehouse = warehouses.find((w) => w.code === 'DIST');

    // Seed Products
    console.log('Seeding products...');
    const products = await Product.bulkCreate(sampleProducts);
    console.log(`Created ${products.length} products`);

    // Create initial stock locations for some products
    console.log('Creating initial stock...');
    const stockLocations = [];
    for (let i = 0; i < Math.min(products.length, 50); i++) {
      const initialStock = Math.floor(Math.random() * 200) + 10;
      stockLocations.push({
        productId: products[i].id,
        warehouseId: mainWarehouse.id,
        location: `Aisle ${Math.floor(i / 10) + 1}`,
        quantity: initialStock,
      });
    }
    await StockLocation.bulkCreate(stockLocations);

    // Create Stock Ledger entries for initial stock
    console.log('Creating initial stock ledger entries...');
    for (const stockLoc of stockLocations) {
      await StockLedger.create({
        productId: stockLoc.productId,
        warehouseId: stockLoc.warehouseId,
        location: stockLoc.location,
        transactionType: 'receipt',
        documentType: 'Receipt',
        documentId: 0,
        documentNumber: 'INITIAL-STOCK',
        quantity: stockLoc.quantity,
        quantityAfter: stockLoc.quantity,
        createdById: users[0].id,
        createdAt: randomDate(30),
      });
    }

    // Seed Receipts (~200)
    console.log('Seeding receipts...');
    const receipts = [];
    for (let i = 0; i < 200; i++) {
      const receiptNumber = `WH/IN/${String(i + 1).padStart(4, '0')}`;
      const status = randomStatus();
      const createdAt = randomDate(90);
      
      const receipt = await Receipt.create({
        receiptNumber,
        supplier: sampleSuppliers[Math.floor(Math.random() * sampleSuppliers.length)],
        warehouseId: warehouses[Math.floor(Math.random() * warehouses.length)].id,
        status,
        scheduleDate: createdAt,
        receivedDate: status === 'done' ? createdAt : undefined,
        validatedAt: status === 'done' ? createdAt : undefined,
        validatedById: status === 'done' ? users[0].id : null,
        createdById: users[Math.floor(Math.random() * users.length)].id,
        createdAt,
      });

      // Create 1-3 items per receipt
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 100) + 10;
        const unitPrice = Math.floor(Math.random() * 5000) + 100;
        
        await ReceiptItem.create({
          receiptId: receipt.id,
          productId: product.id,
          quantity,
          unitPrice,
        });
      }

      // Update stock for completed receipts
      if (status === 'done') {
        const items = await ReceiptItem.findAll({ where: { receiptId: receipt.id } });
        for (const item of items) {
          await updateStock(
            item.productId,
            receipt.warehouseId,
            'Aisle 1',
            item.quantity,
            'receipt',
            'Receipt',
            receipt.id,
            receipt.receiptNumber,
            users[0].id
          );
        }
      }

      receipts.push(receipt);
      if ((i + 1) % 50 === 0) {
        console.log(`  Created ${i + 1} receipts...`);
      }
    }
    console.log(`Created ${receipts.length} receipts`);

    // Seed Delivery Orders (~200)
    console.log('Seeding delivery orders...');
    const orders = [];
    for (let i = 0; i < 200; i++) {
      const orderNumber = `WH/OUT/${String(i + 1).padStart(4, '0')}`;
      const status = randomStatus();
      const createdAt = randomDate(90);
      
      const order = await DeliveryOrder.create({
        orderNumber,
        customer: sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)],
        warehouseId: warehouses[Math.floor(Math.random() * warehouses.length)].id,
        status,
        scheduleDate: createdAt,
        deliveryDate: status === 'done' ? createdAt : undefined,
        validatedAt: status === 'done' ? createdAt : undefined,
        validatedById: status === 'done' ? users[0].id : null,
        createdById: users[Math.floor(Math.random() * users.length)].id,
        createdAt,
      });

      // Create 1-3 items per order
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 50) + 5;
        
        await DeliveryOrderItem.create({
          deliveryOrderId: order.id,
          productId: product.id,
          quantity,
          pickedQuantity: status === 'done' || status === 'ready' ? quantity : Math.floor(Math.random() * quantity),
          packedQuantity: status === 'done' ? quantity : 0,
        });
      }

      // Update stock for completed deliveries
      if (status === 'done') {
        const items = await DeliveryOrderItem.findAll({ where: { deliveryOrderId: order.id } });
        for (const item of items) {
          await updateStock(
            item.productId,
            order.warehouseId,
            'Aisle 1',
            item.quantity,
            'delivery',
            'DeliveryOrder',
            order.id,
            order.orderNumber,
            users[0].id
          );
        }
      }

      orders.push(order);
      if ((i + 1) % 50 === 0) {
        console.log(`  Created ${i + 1} delivery orders...`);
      }
    }
    console.log(`Created ${orders.length} delivery orders`);

    // Seed Transfers (~200)
    console.log('Seeding transfers...');
    const transfers = [];
    for (let i = 0; i < 200; i++) {
      const transferNumber = `WH/MOVE/${String(i + 1).padStart(4, '0')}`;
      const status = randomStatus();
      const createdAt = randomDate(90);
      const fromWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      let toWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      while (toWarehouse.id === fromWarehouse.id) {
        toWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      }
      
      const transfer = await Transfer.create({
        transferNumber,
        fromWarehouseId: fromWarehouse.id,
        toWarehouseId: toWarehouse.id,
        fromLocation: `Aisle ${Math.floor(Math.random() * 5) + 1}`,
        toLocation: `Aisle ${Math.floor(Math.random() * 5) + 1}`,
        status,
        transferDate: createdAt,
        validatedAt: status === 'done' ? createdAt : null,
        validatedById: status === 'done' ? users[0].id : null,
        createdById: users[Math.floor(Math.random() * users.length)].id,
        createdAt,
      });

      // Create 1-2 items per transfer
      const numItems = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 50) + 5;
        
        await TransferItem.create({
          transferId: transfer.id,
          productId: product.id,
          quantity,
        });
      }

      // Update stock for completed transfers
      if (status === 'done') {
        const items = await TransferItem.findAll({ where: { transferId: transfer.id } });
        for (const item of items) {
          // Decrease from source
          await updateStock(
            item.productId,
            transfer.fromWarehouseId,
            transfer.fromLocation || '',
            item.quantity,
            'transfer_out',
            'Transfer',
            transfer.id,
            transfer.transferNumber,
            users[0].id
          );
          // Increase to destination
          await updateStock(
            item.productId,
            transfer.toWarehouseId,
            transfer.toLocation || '',
            item.quantity,
            'transfer_in',
            'Transfer',
            transfer.id,
            transfer.transferNumber,
            users[0].id
          );
        }
      }

      transfers.push(transfer);
      if ((i + 1) % 50 === 0) {
        console.log(`  Created ${i + 1} transfers...`);
      }
    }
    console.log(`Created ${transfers.length} transfers`);

    // Seed Adjustments (~200)
    console.log('Seeding adjustments...');
    const adjustments = [];
    for (let i = 0; i < 200; i++) {
      const adjustmentNumber = `WH/ADJ/${String(i + 1).padStart(4, '0')}`;
      const status = randomStatus();
      const createdAt = randomDate(90);
      
      const adjustment = await Adjustment.create({
        adjustmentNumber,
        status,
        adjustmentDate: createdAt,
        validatedAt: status === 'done' ? createdAt : null,
        validatedById: status === 'done' ? users[0].id : null,
        notes: 'Physical count discrepancy',
        createdById: users[Math.floor(Math.random() * users.length)].id,
        createdAt,
      });

      // Create 1-2 items per adjustment
      const numItems = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
        const stockLoc = await StockLocation.findOne({
          where: {
            productId: product.id,
            warehouseId: warehouse.id,
          },
        });
        const recordedQty = stockLoc ? stockLoc.quantity : 0;
        const physicalQty = Math.max(0, recordedQty + Math.floor(Math.random() * 20) - 10);
        
        await AdjustmentItem.create({
          adjustmentId: adjustment.id,
          productId: product.id,
          warehouseId: warehouse.id,
          location: `Aisle ${Math.floor(Math.random() * 5) + 1}`,
          recordedQuantity: recordedQty,
          physicalQuantity: physicalQty,
          difference: physicalQty - recordedQty,
          reason: ['Damaged', 'Lost', 'Found', 'Counting error', 'Theft'][Math.floor(Math.random() * 5)],
        });
      }

      // Update stock for completed adjustments
      if (status === 'done') {
        const items = await AdjustmentItem.findAll({ where: { adjustmentId: adjustment.id } });
        for (const item of items) {
          await updateStock(
            item.productId,
            item.warehouseId,
            item.location || '',
            item.physicalQuantity,
            'adjustment',
            'Adjustment',
            adjustment.id,
            adjustment.adjustmentNumber,
            users[0].id
          );
        }
      }

      adjustments.push(adjustment);
      if ((i + 1) % 50 === 0) {
        console.log(`  Created ${i + 1} adjustments...`);
      }
    }
    console.log(`Created ${adjustments.length} adjustments`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Warehouses: ${warehouses.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Receipts: ${receipts.length}`);
    console.log(`   Delivery Orders: ${orders.length}`);
    console.log(`   Transfers: ${transfers.length}`);
    console.log(`   Adjustments: ${adjustments.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: john.anderson@stockmaster.com');
    console.log('   Password: password123');
    console.log('\n   Email: sarah.mitchell@stockmaster.com');
    console.log('   Password: password123');

    await sequelize.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await sequelize.close();
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();
