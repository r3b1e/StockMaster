const { Op } = require('sequelize');

// Generate document number in format: WH/IN/0001 or WH/OUT/0001
const generateDocumentNumber = async (Model, prefix, warehouseCode = 'WH', fieldName = 'receiptNumber') => {
  try {
    // Build query for Sequelize
    const where = {};
    where[fieldName] = {
      [Op.like]: `${warehouseCode}/${prefix}/%`,
    };
    
    // Get the last document to find the highest number
    const lastDoc = await Model.findOne({
      where,
      order: [[fieldName, 'DESC']],
    });

    let nextNumber = 1;

    if (lastDoc) {
      // Extract the number from the last document number
      const docNumber = lastDoc[fieldName];
      const parts = docNumber.split('/');
      if (parts.length === 3) {
        const lastNumber = parseInt(parts[2], 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    // Pad the number with zeros (4 digits: 0001, 0002, etc.)
    const paddedNumber = String(nextNumber).padStart(4, '0');
    return `${warehouseCode}/${prefix}/${paddedNumber}`;
  } catch (error) {
    console.error('Error generating document number:', error);
    // Fallback: use timestamp-based number
    const timestamp = Date.now().toString().slice(-4);
    return `${warehouseCode}/${prefix}/${timestamp}`;
  }
};

// Helper for receipt numbers (WH/IN/XXXX)
const generateReceiptNumber = async (Model, warehouseCode) => {
  return generateDocumentNumber(Model, 'IN', warehouseCode, 'receiptNumber');
};

// Helper for delivery order numbers (WH/OUT/XXXX)
const generateDeliveryNumber = async (Model, warehouseCode) => {
  return generateDocumentNumber(Model, 'OUT', warehouseCode, 'orderNumber');
};

// Helper for transfer numbers
const generateTransferNumber = async (Model, warehouseCode) => {
  return generateDocumentNumber(Model, 'MOVE', warehouseCode, 'transferNumber');
};

// Helper for adjustment numbers
const generateAdjustmentNumber = async (Model, warehouseCode) => {
  return generateDocumentNumber(Model, 'ADJ', warehouseCode, 'adjustmentNumber');
};

module.exports = {
  generateReceiptNumber,
  generateDeliveryNumber,
  generateTransferNumber,
  generateAdjustmentNumber,
};
