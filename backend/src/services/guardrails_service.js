const Merchant =  require('../models/Merchant');
const checkTransactionLimit=async (totalAmount) => {

    const merchant=await Merchant.findOne({});

    if (!merchant) {
    throw new Error('Merchant not found');
  }

  const requiresApproval = totalAmount > merchant.transaction_limit;

  return {
    requiresApproval,
    transactionLimit: merchant.transaction_limit,
    totalAmount: totalAmount,
    reason: requiresApproval
      ? `Amount ₹${totalAmount} exceeds autonomous limit of ₹${merchant.transaction_limit}`
      : `Amount ₹${totalAmount} is within autonomous limit of ₹${merchant.transaction_limit}`,
  };
    
}

module.exports={checkTransactionLimit};