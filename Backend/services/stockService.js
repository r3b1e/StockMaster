const { Product, StockLocation, StockLedger, sequelize } = require('../models');

const updateStock = async (productId, warehouseId, location, quantity, transactionType, documentType, documentId, documentNumber, userId, existingTransaction = null) => {
  const shouldCommit = !existingTransaction;
  const transaction = existingTransaction || await sequelize.transaction();
  
  try {
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      throw new Error('Product not found');
    }

    // Find or create stock location
    const normalizedLocation = location || '';
    let stockLocation = await StockLocation.findOne({
      where: {
        productId,
        warehouseId,
        location: normalizedLocation,
      },
      transaction,
    });

    if (!stockLocation) {
      stockLocation = await StockLocation.create({
        productId,
        warehouseId,
        location: normalizedLocation,
        quantity: 0,
      }, { transaction });
    }

    // Update quantity based on transaction type
    const oldQuantity = stockLocation.quantity;
    let newQuantity = oldQuantity;

    switch (transactionType) {
      case 'receipt':
      case 'transfer_in':
        newQuantity = oldQuantity + quantity;
        break;
      case 'delivery':
      case 'transfer_out':
        newQuantity = Math.max(0, oldQuantity - quantity);
        break;
      case 'adjustment':
        newQuantity = quantity; // For adjustments, quantity is the new physical quantity
        break;
      default:
        throw new Error('Invalid transaction type');
    }

    stockLocation.quantity = newQuantity;
    await stockLocation.save({ transaction });

    // Create ledger entry
    await StockLedger.create({
      productId,
      warehouseId,
      location: normalizedLocation,
      transactionType,
      documentType,
      documentId,
      documentNumber,
      quantity: transactionType === 'adjustment' ? newQuantity - oldQuantity : quantity,
      quantityAfter: newQuantity,
      createdById: userId,
    }, { transaction });

    if (shouldCommit) {
      await transaction.commit();
    }

    return { product, oldQuantity, newQuantity };
  } catch (error) {
    if (shouldCommit && transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

module.exports = { updateStock };
